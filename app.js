const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")('sk_test_51OuEvESAeZejphLoM1GrPXGd4gG4oXoPEqONabMhQICOQi8DyvWQeNpgz7mhfx3KvYCkYqC7xNVJKtqm29TAY89n00VLpI2get')

app.use(express.json());
app.use(cors());

// checkout api
app.post("/api/create-checkout-session", async (req, res) => {
    const { products } = req.body;
    console.log(products[0]?.product?.price)

    const lineItems = products.map((product) => ({
        price_data: {
            currency: "inr",
            product_data: {
                name: product?.product?.producttitle,
                images: [product?.product?.prodimage],
            },
            unit_amount: product?.product?.price * 100,
        },
        quantity: product.quantity
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ id: session.id })

})


app.listen(7000, () => {
    console.log("server start")
})

