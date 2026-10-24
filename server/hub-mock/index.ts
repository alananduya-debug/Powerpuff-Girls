export type Role = "Staff" | "Accountant" | "Owner";

export type HubUser = {
  id: string;
  name: string;
  role: Role;
};

export type HubSupplier = {
  id: string;
  name: string;
  tin: string;
};

export type HubEventPublisher = (
  name: string,
  payload: Record<string, unknown>,
) => void;

let eventPublisher: HubEventPublisher | undefined;

export function setEventPublisher(publisher: HubEventPublisher): void {
  eventPublisher = publisher;
}

export function publishEvent(
  name: string,
  payload: Record<string, unknown>,
): void {
  if (!eventPublisher) {
    throw new Error("The simulated hub event store is not configured.");
  }
  eventPublisher(name, payload);
}

const users: HubUser[] = [
  { id: "siti", name: "Siti", role: "Staff" },
  { id: "mr-tan", name: "Mr Tan", role: "Accountant" },
  { id: "ms-lim", name: "Ms Lim", role: "Owner" },
];

const suppliers: HubSupplier[] = [
  { id: "bumi-office", name: "Bumi Office Supply Sdn Bhd", tin: "IG10000000010" },
  { id: "serene-pantry", name: "Serene Pantry Trading", tin: "IG20000000020" },
  { id: "sinar-print", name: "Sinar Printworks", tin: "IG30000000030" },
  { id: "northstar-it", name: "Northstar IT Services", tin: "IG40000000040" },
  { id: "ming-hua", name: "明华文具贸易有限公司", tin: "IG50000000050" },
];

export function listUsers(): HubUser[] {
  return users.map((user) => ({ ...user }));
}

export function getCurrentUser(userId: string | undefined): HubUser {
  return users.find((user) => user.id === userId) ?? users[0]!;
}

export function listSuppliers(): HubSupplier[] {
  return suppliers.map((supplier) => ({ ...supplier }));
}

export function getSupplier(supplierId: string): HubSupplier | undefined {
  const supplier = suppliers.find((item) => item.id === supplierId);
  return supplier ? { ...supplier } : undefined;
}
