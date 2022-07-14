import {useState} from "react";

function App() {
    const [purchaseName, setPurchaseName] = useState("purchaseName")
    const [purchases, setPurchases] = useState([])
    const apiUrl = 'http://localhost:5000/purchases';

    async function createPurchase(){
        try {
            const body = JSON.stringify({
                name: purchaseName,
                complete: false
            });
            const result = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body
            })
            const resultJson = await result.json();
            console.log(resultJson);
        }catch(e){
            console.error(e);
        }
    }
    async function getPurchases(){
        const result = await fetch(apiUrl);
        const resultJson = await result.json();
        setPurchases(resultJson);
        console.log(resultJson);
    }

    return (
        <div>
            <h1>Kafka test</h1>
            <div>
                <input type="text" value={purchaseName} onChange={(e) => setPurchaseName(e.target.value)}/>
                <button type="button" onClick={createPurchase}>Create purchase</button>
            </div>
            <button onClick={getPurchases}>Get purchases</button>
            <ul>
                {purchases.map((purchase, ii) => <li key={`p-${ii}`}>id: {purchase._id}, name: {purchase.name}, complete: {purchase.complete ? "true" : "false"}</li>)}
            </ul>
        </div>
    );
}

export default App;
