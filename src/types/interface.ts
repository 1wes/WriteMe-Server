export default interface EnvConfig {
  port: string;
  secret_key: string;
  client_origin: string;
  senderEmail: string;
  password: string;
}

export interface Orders {
  username: string;
  totalOrders: number;
  allActiveOrders: number;
  allCancelledOrders: number;
  allCompletedOrders: number;
  allOrders: [] | {}[];
}
