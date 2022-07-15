package consumer

import (
	"damien.com/risk-assessment/protos/purchase"
	"github.com/segmentio/kafka-go"
	"google.golang.org/protobuf/proto"
)

// https://github.com/riferrei/srclient
// https://github.com/riferrei/srclient/blob/master/EXAMPLES_PROTOBUF.md
// https://github.com/riferrei/srclient/issues/16

import (
	"context"
	"fmt"
	"log"
)

func Consumer() {
	//schemaRegistryClient := srclient.CreateSchemaRegistryClient("http://localhost:8081")
	//
	//schemaSubject := "proto.Purchase"
	//schema, err := schemaRegistryClient.GetLatestSchema(schemaSubject)
	//if err != nil {
	//	panic(fmt.Sprintf("Error getting the schema with id '%d' %s", schemaSubject, err))
	//}

	// make a new reader that consumes from purchase-created, partition 0, at offset 42
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers:   []string{"localhost:9092"},
		Topic:     "purchase-created",
		Partition: 0,
		MinBytes:  10e3, // 10KB
		MaxBytes:  10e6, // 10MB
	})

	for {
		m, err := r.ReadMessage(context.Background())
		if err != nil {
			break
		}
		fmt.Printf("message at offset %d: %s = %s\n", m.Offset, string(m.Key), string(m.Value))

		/*
			This is the code for deserializing using schemareg and arvo.
			anyway, it does not work... with the protobuf message
		*/
		//if string(m.Key) == "proto.Purchase" {
		//	//schema
		//	native, _, err := schema.Codec().NativeFromBinary(m.Value)
		//	if err != nil {
		//		fmt.Println("Well that didn't work!", err)
		//		continue
		//	}
		//	value, _ := schema.Codec().TextualFromNative(nil, native)
		//	fmt.Printf("Here is the message %s\n", string(value))
		//}

		/*
			I think this is just trying to take the binary kafka message and squish it into a purchase proto struct
			anyway, it does not work...

			"Failed to parse event proto: cannot parse invalid wire-format data"
		*/
		p := &purchase.PurchaseMessage{}
		if err := proto.Unmarshal(m.Value, p); err != nil {
			fmt.Println("Failed to parse event", err, m.Value, string(m.Value))
			continue
		}
		fmt.Println("purchase", p)
	}

	if err := r.Close(); err != nil {
		log.Fatal("failed to close reader:", err)
	}
}
