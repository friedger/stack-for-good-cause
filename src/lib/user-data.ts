import { hexToBytes } from "@stacks/common";
import { ClarityType, deserializeCV, PrincipalCV } from "@stacks/transactions";

export const parseUserData = (hexString: string) => {
  // Convert hex string to bytes and deserialize
  const bytes = hexToBytes(hexString);
  const deserializedCV = deserializeCV(bytes);
  console.log("Deserialized CV:", deserializedCV);
  // Extract data from the tuple structure
  // Assuming the structure is: { v: uint, c: string-ascii, p: list of principals, r: list of uints }
  if (deserializedCV.type === ClarityType.Tuple) {
    const tupleData = deserializedCV.value;

    const version =
      tupleData.v?.type === ClarityType.UInt ? Number(tupleData.v.value) : 0;
    const currency =
      tupleData.c?.type === ClarityType.StringASCII ? tupleData.c.value : "";

    const addresses: string[] = [];
    const ratios: number[] = [];

    if (tupleData.p?.type === ClarityType.List) {
      tupleData.p.value.forEach((principal: any) => {
        if (
          principal.type === ClarityType.PrincipalStandard ||
          principal.type === ClarityType.PrincipalContract
        ) {
          addresses.push((principal as PrincipalCV).value);
        }
      });
    }

    if (tupleData.r?.type === ClarityType.List) {
      tupleData.r.value.forEach((share: any) => {
        if (share.type === ClarityType.UInt) {
          ratios.push(Number(share.value));
        }
      });
    }

    return {
      version,
      currency,
      addresses,
      ratios,
    };
  }
};
