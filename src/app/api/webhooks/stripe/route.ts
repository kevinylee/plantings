import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

// accepts the Stripe key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
    // retrieve stripe signature
    const sig = req.headers.get("stripe-signature");
    if (!sig) return new Response("Missing stripe-signature", { status: 400 });

    // retrieve webhook secret
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) return new Response("Missing webhook secret", { status: 500 });

    // ***Stripe needs RAW body to verify signature***
    const rawBody = await req.text();

    // Retrieving the event 
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err:any) {
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // handling event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log("Donation Completed!!! :)", {
            id: session.id,
            amount_total: session.amount_total,
            currency: session.currency,
            customer_email: session.customer_details?.email,
            payment_intent: session.payment_intent,
        });

        console.log("About to save donation with session:", session.id, "and event:", event.id);

        try {
            await prisma.donation.upsert({
                where: { stripeCheckoutSessionId: session.id },
                update: {
                    stripeEventId: event.id,
                    stripePaymentIntentId: session.payment_intent?.toString() ?? null,
                    amountTotal: session.amount_total ?? 0,
                    currency: session.currency ?? "usd",
                    donorEmail: session.customer_details?.email ?? null,
                    status: "succeeded",
                },
                create: {
                    stripeEventId: event.id,
                    stripeCheckoutSessionId: session.id,
                    stripePaymentIntentId: session.payment_intent?.toString() ?? null,
                    amountTotal: session.amount_total ?? 0,
                    currency: session.currency ?? "usd",
                    donorEmail: session.customer_details?.email ?? null,
                    status: "succeeded",
                },
            });

            console.log("Donation is saved to DB:", session.id);
        } catch (err) {
            console.error("Failed to save donation:", err);
            return new Response("Database write failed", { status: 500 });
        }
    }

    return new Response("okayyy", { status: 200 });
}
