export default function SuccessPage() {
    console.log("im in success page");
    return (
        <div className="flex justify-center">
            <h1>Thank You!</h1>
            <a className="underline" href="/">Back to Garden</a>
        </div>
    );
}
