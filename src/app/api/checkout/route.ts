import Stripe from "stripe";

// accepts the Stripe key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// creates an endpoint, POST /api/checkout
export async function POST(req: Request) {
    try {
        const { amount } = await req.json(); // parse the amount requested, ex. { "amount": 25 }
        
        // validate the number: no negative values, no non-numbers, no manual requests
        const num = Number(amount);
        if (!Number.isFinite(num) || num <= 0) {
            return Response.json({ error: "Invalid amount." }, { status: 400 });
        }

        // Stripe expects cents
        const amountInCents = Math.round(num * 100);

        
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!; // will be used for the success and/or cancel page
        // a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            mode: "payment", // one-time payment
            payment_method_types: ["card"], // accept card payment
            line_items: [ // what is being bought
                {
                    quantity: 1,
                    price_data: {
                        currency: "usd",
                        unit_amount: amountInCents,
                        product_data: { name: "Planting Donation" },
                    },
                },
            ],
            metadata: {
                source: "planting_mvp0",
            },
            success_url: `${baseUrl}/success`, // where to go after payment success
            cancel_url: `${baseUrl}/cancel`, // where to go if payment is canceled
        });

        return Response.json({ url: session.url }); // return a session object
    } catch (err: any) { // catch any errors if the payment fails
        return Response.json(
            { error: err?.message || "Server error" },
            { status: 500 }
        );
    }
}
