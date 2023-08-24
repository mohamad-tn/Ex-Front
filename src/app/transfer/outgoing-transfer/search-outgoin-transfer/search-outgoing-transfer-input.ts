export class SearchOutgoingTransferInput{
    number: Number | undefined;
    fromDate: string | undefined;
    toDate: string | undefined;
    paymentType: number | undefined;
    countryId: number | undefined;
    clientId: number | undefined;
    companyId: number | undefined;
    beneficiary: string | undefined;
    beneficiaryAddress: string | undefined;
    sender: string | undefined;
}