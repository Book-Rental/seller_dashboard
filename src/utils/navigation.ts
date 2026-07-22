export const redirectToOrders = () => {
  window.history.pushState({}, "", "/orders");
  window.dispatchEvent(new PopStateEvent("popstate"));
};

export const redirectToOrderDetails = (orderId: string) => {
  window.history.pushState(
    {},
    "",
    `/order-details?orderId=${orderId}`
  );

  window.dispatchEvent(new PopStateEvent("popstate"));
};