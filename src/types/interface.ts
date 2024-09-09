export default interface EnvConfig {
  port: string;
  secret_key: string;
  client_origin: string;
  senderEmail: string;
  password: string;
}

export type OrderDetails = [
  string, // orderId
  number, // createdBy
  string, // service
  string, // subject
  string, // gradeLevel
  string, // style
  string, // language
  string, // sources
  string, // newFiles
  string, // instructions
  string, // topic
  string, // pagesOrwords
  string, // amount
  string, // deadline
  string, // time
  string // status
];

export interface Orders {
  username: string;
  totalOrders: number;
  allActiveOrders: number;
  allCancelledOrders: number;
  allCompletedOrders: number;
  allOrders: [] | {}[];
}
