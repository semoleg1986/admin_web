import { createEventStream, fetchWithEvent, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const status = typeof query.status === "string" && query.status ? query.status : "pending";
  const selectedPaymentIntentId =
    typeof query.selected_payment_intent_id === "string" && query.selected_payment_intent_id
      ? query.selected_payment_intent_id
      : "";

  const eventStream = createEventStream(event);
  let disposed = false;
  let lastSnapshot = "";

  const fetchSnapshot = async () => {
    const list = await fetchWithEvent(
      event,
      `/api/admin/payments/intents?status=${encodeURIComponent(status)}&limit=50&offset=0`
    );

    const selectedPaymentIntent = selectedPaymentIntentId
      ? await fetchWithEvent(event, `/api/admin/payments/intents/${selectedPaymentIntentId}`)
      : null;

    return JSON.stringify({ items: list, selected_payment_intent: selectedPaymentIntent });
  };

  const tick = async () => {
    if (disposed) {
      return;
    }

    const nextSnapshot = await fetchSnapshot();
    if (nextSnapshot !== lastSnapshot) {
      lastSnapshot = nextSnapshot;
      await eventStream.push({ event: "update", data: nextSnapshot });
    }
  };

  const interval = setInterval(() => {
    void tick();
  }, 5000);

  eventStream.onClosed(async () => {
    disposed = true;
    clearInterval(interval);
    await eventStream.close();
  });

  await tick();
  return eventStream.send();
});
