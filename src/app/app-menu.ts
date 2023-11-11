import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: "Home",
    icon: "home-outline",
    link: "/app/home",
  },
  {
    title: "Settings",
    icon: "settings-outline",
    children: [
      {
        title: "Branches",
        link: "/app/setting/branch",
      },
      {
        title: "Countries",
        link: "/app/setting/country",
      },
      {
        title: "Currencies",
        link: "/app/setting/currency",
      },
      {
        title: "Companies",
        link: "/app/setting/company",
      },
      {
        title: "Clients",
        link: "/app/setting/client",
      },
      {
        title: "InitialBalance",
        link: "/app/setting/initial-balance",
      },
      {
        title: "Commision",
        link: "/app/setting/commision",
      },
      {
        title: "Expenses",
        link: "/app/setting/expense",
      },
      {
        title: "Incomes",
        link: "/app/setting/income",
      },
      {
        title: "ExchangePrice",
        link: "/app/setting/exchange-price",
      },
      {
        title: "الاعدادات العامة",
        link: "/app/setting/general-setting",
      },
    ],
  },
  {
    title: "Transfers",
    icon: "trending-up-outline",
    children: [
      {
        title: "OutgoingTransfers",
        link: "/app/transfer/create-outgoing-transfer",
      },
      {
        title: "IncomeTransfers",
        link: "/app/transfer/create-income-transfer",
      },
      {
        title: "NoneReceivedTransfer",
        link: "/app/transfer/direct-transfer",
      },
      {
        title: "IncomeTransferNotAccepted",
        link: "/app/transfer/income-transfer-notAccepted",
      },
    ],
  },
  {
    title: "ExchangeCurrency",
    icon: "repeat-outline",
    link: "/app/exchange-currency/create",
  },
  {
    title: "Treasury",
    icon: "archive-outline",
    link: "/app/treasury/treasury-action",
  },
  {
    title: "Statements",
    icon: "file-text-outline",
    children: [
      {
        title: "ClientBalanceStatement",
        link: "/app/statement/total-client-balance-statement",
      },
      {
        title: "CompanyBalanceStatement",
        link: "/app/statement/total-company-balance-statement",
      },
      {
        title: "TreasuryBalanceStatement",
        link: "/app/statement/treasury-balance-statement",
      },
      {
        title: "TotalBalanceStatement",
        link: "/app/statement/total-balance-statement",
      },
      {
        title: "OutgoingTransferStatement",
        link: "/app/statement/outgoing-transfer-statement",
      },
      {
        title: "SpendsStatment",
        link: "/app/statement/spends-statement",
      },
      {
        title: "ReceiptsStatment",
        link: "/app/statement/receipts-statement",
      },
      {
        title: "DefaultersOfPayment",
        link: "/app/statement/defaulters-of-payment-statement",
      }, //
      {
        title: "InactiveClientStatment",
        link: "/app/statement/inactive-client-statement",
      },
      {
        title: "ExchangeCurrencyStatement",
        link: "/app/statement/exchange-currency-statement",
      },
      {
        title: "Management",
        link: "/app/statement/management-statement",
      },

      {
        title: "Summary",
        link: "/app/statement/summary-statement",
      },
    ], //
  },
  {
    title: "Auth",
    icon: "lock-outline",
    children: [
      {
        title: "Users",
        link: "/app/security/user",
      },
      {
        title: "Roles",
        link: "/app/security/role",
      },
    ],
  },
];
