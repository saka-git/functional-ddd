const plus3 = (x: number) => x + 3;

const times2 = (x: number) => x * 2;

const square = function (x: number) {
  return x * x;
};

const addThree = plus3;

const listofFunctions = [addThree, times2, square];

const evalWith5ThenAdd2 = (fn: (x: number) => number): number => fn(5) + 2;

console.log(evalWith5ThenAdd2(addThree));
// 10

const add1 = (x: number) => x + 1;
const add2 = (x: number) => x + 2;
const add3 = (x: number) => x + 3;

const adderGenerator = (x: number) => {
  return (y: number) => x + y;
};

const add4 = adderGenerator(4);

console.log(add4(1));
// 5

const add = (x: number, y: number) => x + y;

const addCurried = (x: number) => (y: number) => x + y;

// 部分適用
const add5 = addCurried(5);

console.log(add5(1));
// 6

const sayGreeting = (greeting: string) => (name: string) =>
  `${greeting} ${name}`;

const sayHello = sayGreeting("Hello");
const sayHi = sayGreeting("Hi");

console.log(sayHello("John"));
// Hello John
console.log(sayHello("Sue"));
// Hello Sue

const addCurried2 = (x: number) => (y: number) => x + y;

const add10 = addCurried2(10);

console.log(add10(5));
// 15

const twelveDividedBy = (x: number) => {
  switch (x) {
    case 6:
      return 2;
    case 1:
      return 12;
    case 0:
      return null;
    default:
      return 12 / x;
  }
};

console.log(twelveDividedBy(6));
// 2

type NonZeroInteger = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const twelveDividedByNonZeroInteger = (x: NonZeroInteger) => {
  switch (x) {
    case 1:
      return 12;
    case 2:
      return 6;
    // case 0:
    //   return 4;
  }
};

// Option.ts

// Option<T> は Some<T> または None のいずれか
export type Option<T> = Some<T> | None;

// Some<T> は値を保持する
export type Some<T> = {
  type: "Some";
  value: T;
};

// None は値を持たない
export type None = {
  type: "None";
};

const twelveDividedByWithOptional = (x: number): Option<number> => {
  switch (x) {
    case 0:
      return { type: "None" };
    default:
      return { type: "Some", value: 12 / x };
  }
};

console.log(twelveDividedByWithOptional(6));
// 2

// !
// 関数オーバーロードの宣言
export function pipe<A, B>(ab: (a: A) => B): (a: A) => B;
export function pipe<A, B, C>(ab: (a: A) => B, bc: (b: B) => C): (a: A) => C;
export function pipe<A, B, C, D>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D
): (a: A) => D;
// ... 必要に応じてオーバーロードを増やす

// 実装
export function pipe(...fns: Array<(x: any) => any>) {
  return (input: any) => fns.reduce((acc, fn) => fn(acc), input);
}

// !
// // 先頭の関数の型を取り出すヘルパー型
// type FirstFn<T extends any[]> = T extends [infer F, ...any[]] ? F : never;
// // 最後の関数の型を取り出すヘルパー型
// type LastFn<T extends any[]> = T extends [...any[], infer L] ? L : never;

// /**
//  * 複数の関数を左から右へ合成する pipe 関数
//  * - 第一の関数の引数型が合成関数全体の引数型となり、
//  * - 最後の関数の戻り値型が合成関数全体の戻り値型となる。
//  */
// export function pipe<
//   T extends [(...args: any[]) => any, ...Array<(arg: any) => any>]
// >(
//   ...fns: T
// ): (
//   ...args: Parameters<FirstFn<T>>
// ) => ReturnType<LastFn<T> & ((...args: any) => any)> {
//   return (...args: any[]) => {
//     let result = args;
//     for (const fn of fns) {
//       result = [fn.apply(null, result)];
//     }
//     return result[0];
//   };
// }

// !
// // pipe.ts

// /** すべての「可変長引数をとって何かを返す」関数を表す型 */
// type Fn = (...args: any[]) => any;

// /**
//  * タプル型 T の最後の要素を取り出すユーティリティ型
//  * 例: Last<[number, string, boolean]> = boolean
//  */
// type Last<T extends any[]> = T extends [...any[], infer L] ? L : never;

// /**
//  * 関数の配列 T を受け取り、
//  * - 最初の関数の引数型 (Parameters<T[0]>) が全体の引数型、
//  * - 最後の関数の戻り値型 (ReturnType<Last<T>>) が全体の戻り値型、
//  * となる合成関数を返す。
//  */
// export function pipe<T extends [Fn, ...Fn[]]>(
//   ...fns: T
// ): (...args: Parameters<T[0]>) => ReturnType<Last<T>> {
//   return (...args: Parameters<T[0]>) => {
//     return fns.reduce((acc, fn) => [fn(...acc)], args)[0] as ReturnType<
//       Last<T>
//     >;
//   };
// }

const add10AndSquare = pipe(add10, square);
console.log("add10AndSquare(5)", add10AndSquare(5));
// 225

const a = (x: number) => x + 1;
const b = (x: number) => "say " + x;

const add1AndSay = pipe(a, b);

console.log("add1AndSay(1)", add1AndSay(1));
// say 2

const add1Sub = (x: number) => x + 1;

const printOption = (x: Option<number>) => {
  switch (x.type) {
    case "Some":
      console.log(x.value);
      break;
    case "None":
      console.log("None");
  }
};

const numberToOption = (x: number): Option<number> => {
  return x === 0 ? { type: "None" } : { type: "Some", value: x };
};

const add1SubAndPrintOption = pipe(add1Sub, numberToOption, printOption);

console.log("add1SubAndPrintOption(3)");
add1SubAndPrintOption(3);

type OrderId = {
  type: "OrderId";
  value: string;
};

const createOrderId = (value: string): OrderId => {
  if (value.length === 0) {
    throw new Error("OrderId must not be empty");
  }
  if (value.length > 50) {
    throw new Error("OrderId must be 50 characters or less");
  }

  return {
    type: "OrderId",
    value,
  };
};

const valueOfOrderId = (orderId: OrderId): string => orderId.value;

// type CheckProductCodeExists = (productCode: string) => boolean;
// type CheckAddressExists = (address: string) => boolean;

type CustomerInfo = {
  type: "CustomerInfo";
  name: PersonalName;
  emailAddress: EmailAddress;
};

type UnvalidatedCustomerInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
};

const toCustomerInfo = (customer: UnvalidatedCustomerInfo): CustomerInfo => {
  const firstName = createString50(customer.firstName);
  const lastName = createString50(customer.lastName);

  const name: PersonalName = {
    type: "PersonalName",
    firstName,
    lastName,
  };

  const emailAddress = emailAddressCreate(customer.email);

  return {
    type: "CustomerInfo",
    name,
    emailAddress,
  };
};

type String50 = {
  type: "String50";
  value: string;
};

const createString50 = (value: string): String50 => {
  if (value.length > 50) {
    throw new Error("String must be 50 characters or less");
  }
  return {
    type: "String50",
    value,
  };
};

type EmailAddress = {
  type: "EmailAddress";
  value: string;
};

const emailAddressCreate = (email: string): EmailAddress => {
  if (!email.includes("@")) {
    throw new Error("Email must contain @");
  }
  return {
    type: "EmailAddress",
    value: email,
  };
};

type PersonalName = {
  type: "PersonalName";
  firstName: String50;
  lastName: String50;
};

type UnvalidatedAddress = {
  type: "UnvalidatedAddress";
  addressLine1: string;
  addressLine2: string | null;
  addressLine3: string | null;
  addressLine4: string | null;
  city: string;
  zipCode: string;
};

type Address = {
  type: "Address";
  addressLine1: String50;
  addressLine2: String50 | null;
  addressLine3: String50 | null;
  addressLine4: String50 | null;
  city: String50;
  zipCode: ZipCode;
};

const toAddress =
  (checkAddressExists: CheckAddressExists) =>
  (unvalidatedAddress: UnvalidatedAddress): Address => {
    // リモートサービス呼び出し
    const checkedAddress = checkAddressExists(unvalidatedAddress);

    const addressLine1 = createString50(checkedAddress.addressLine1);
    const addressLine2 = createString50Option(checkedAddress.addressLine2);
    const addressLine3 = createString50Option(checkedAddress.addressLine3);
    const addressLine4 = createString50Option(checkedAddress.addressLine4);
    const city = createString50(checkedAddress.city);
    const zipCode = createZipCode(checkedAddress.zipCode);

    return {
      type: "Address",
      addressLine1,
      addressLine2,
      addressLine3,
      addressLine4,
      city,
      zipCode,
    };
  };

type CheckAddressExists = (addr: UnvalidatedAddress) => UnvalidatedAddress;

const createString50Option = (value: string | null): String50 | null => {
  if (!value) {
    return null;
  }

  if (value.length > 50) {
    throw new Error("String must be 50 characters or less");
  }

  return { type: "String50", value };
};

type ZipCode = {
  type: "ZipCode";
  value: string;
};

const createZipCode = (value: string): ZipCode => {
  if (value.length !== 8) {
    throw new Error("ZipCode must be 8 characters");
  }
  return { type: "ZipCode", value };
};

type UnValidatedOrderLine = {
  type: "UnValidatedOrderLine";
  orderLineId: string;
  productCode: string;
  quantity: number;
};

type ValidatedOrderLine = {
  type: "ValidatedOrderLine";
  orderLineId: OrderLineId;
  productCode: ProductCode;
  quantity: OrderQuantity;
};

const toValidatedOrderLine =
  (checkProductCodeExists: CheckProductCodeExists) =>
  (unValidatedOrderLine: UnValidatedOrderLine): ValidatedOrderLine => {
    const orderLineId = createOrderLineId(unValidatedOrderLine.orderLineId);
    const productCode = toProductCode(checkProductCodeExists)(
      unValidatedOrderLine.productCode
    );
    const quantity = toOrderQuantity(productCode)(
      unValidatedOrderLine.quantity
    );

    return {
      type: "ValidatedOrderLine",
      orderLineId,
      productCode,
      quantity,
    };
  };

type OrderLineId = {
  type: "OrderLineId";
  value: string;
};

const createOrderLineId = (value: string): OrderLineId => {
  if (value.length === 0) {
    throw new Error("OrderLineId must not be empty");
  }
  return { type: "OrderLineId", value };
};

// type ProductCode = {
//   type: "ProductCode";
//   value: Widget | Gizmo;
// };

type Widget = { type: "Widget"; value: string };
type Gizmo = { type: "Gizmo"; value: string };

type ProductCode = Widget | Gizmo;

type UnitQuantity = {
  type: "UnitQuantity";
  value: number;
};
type KilogramQuantity = {
  type: "KilogramQuantity";
  value: number;
};
type OrderQuantity = UnitQuantity | KilogramQuantity;

type CheckProductCodeExists = (productCode: ProductCode) => boolean;

const createProductCode = (value: string): ProductCode => {
  return { type: "Widget", value };
};

function predicateToPassthru<T>(
  errorMsg: string
): (predicate: (x: T) => boolean) => (x: T) => T {
  return (predicate: (x: T) => boolean) => (x: T) => {
    if (predicate(x)) return x;
    else throw new Error(errorMsg);
  };
}

const toProductCode =
  (checkProductCodeExists: CheckProductCodeExists) =>
  (value: string): ProductCode => {
    const validateProductExists = predicateToPassthru<ProductCode>(
      "ProductCode must exist"
    )(checkProductCodeExists);

    return pipe(createProductCode, validateProductExists)(value);
  };

// type OrderQuantity = {
//   type: "OrderQuantity";
//   value: number;
// };

const toOrderQuantity =
  (productCode: ProductCode) =>
  (value: number): OrderQuantity => {
    if (value <= 0) {
      throw new Error("OrderQuantity must be greater than 0");
    }
    if (productCode.type === "Widget") {
      return { type: "UnitQuantity", value };
    }
    return { type: "KilogramQuantity", value };
  };

// ファクトリ関数
const UnitQuantity = {
  create: (qty: number): UnitQuantity => ({
    type: "UnitQuantity",
    value: Math.floor(qty),
  }),
};

const KilogramQuantity = {
  create: (qty: number): KilogramQuantity => ({
    type: "KilogramQuantity",
    value: qty,
  }),
};

type UnValidatedOrder = {
  type: "UnValidatedOrder";
  orderId: string;
  customerInfo: UnvalidatedCustomerInfo;
  address: UnvalidatedAddress;
  orderLines: UnValidatedOrderLine[];
};

export type ValidatedOrder = {
  type: "ValidatedOrder";
  orderId: OrderId;
  customerInfo: CustomerInfo;
  shippingAddress: Address;
};

type ValidateOrder = (
  checkProductCodeExists: CheckProductCodeExists
) => (
  checkAddressExists: CheckAddressExists
) => (unValidatedOrder: UnValidatedOrder) => ValidatedOrder;

const validateOrder: ValidateOrder =
  (checkProductCodeExists) => (checkAddressExists) => (unValidatedOrder) => {
    const orderId = createOrderId(unValidatedOrder.orderId);
    const customerInfo = toCustomerInfo(unValidatedOrder.customerInfo);
    const shippingAddress = toAddress(checkAddressExists)(
      unValidatedOrder.address
    );
    const orderLines = unValidatedOrder.orderLines.map((orderLine) =>
      toValidatedOrderLine(checkProductCodeExists)(orderLine)
    );

    return {
      type: "ValidatedOrder",
      orderId,
      customerInfo,
      shippingAddress,
      orderLines,
    };
  };

const checkProductCodeExists = (productCode: ProductCode) => true;
const checkAddressExists = (address: UnvalidatedAddress) => address;

const validateOrderWithDependenciesBakedIn = validateOrder(
  checkProductCodeExists
)(checkAddressExists);

// !
// !
// !
// !
// ! price.ts
type PriceOrder = {
  type: "PriceOrder";
  orderId: OrderId;
  customerInfo: CustomerInfo;
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  orderLines: ValidatedOrderLine[];
  totalPrice: number;
};

const priceOrder = (order: ValidatedOrder): PriceOrder => {
  const totalPrice = order.orderLines.reduce((acc, line) => {
    return acc + line.price * line.quantity;
  }, 0);

  return {
    type: "PriceOrder",
  };
};
