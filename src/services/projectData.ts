import { Project } from "./projectCore";

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Fast Pool",
    description: "Your contribution keeps the Fast Pool signer running.",
    fullDescription:
      "Fast Pool is the oldest and most trustless Stacking pool. ",
    category: "Infrastructure",
    totalRaised: 2450.75,
    backers: 23,
    status: "approved",
    creator: "FastPool",
    stxAddress: "SP2ZNPXGZ8S4GE568QSCF66PT02BZ63Y4W3Y7BHNZ",
    image:
      "https://images.unsplash.com/photo-1563209304-83decde702ce?w=400&h=250&fit=crop",
    slug: "fast-pool",
    updates: [
      {
        id: "1",
        title: "First Well Completed!",
        content:
          "We're excited to announce that our first well has been completed in Rural Village A. The community now has access to clean water for the first time in decades!",
        date: "2024-01-15",
        nostrEventId: "nostr_1704902400000_abc123def",
      },
      {
        id: "2",
        title: "Community Training Program Launched",
        content:
          "We've started training local community members on well maintenance and water conservation practices to ensure long-term sustainability.",
        date: "2024-01-10",
        nostrEventId: "nostr_1704470400000_xyz789ghi",
      },
    ],
    backersList: [
      {
        id: "1",
        name: "Alice Chen",
        amount: 500,
        date: "2024-01-20",
        message: "Amazing work! Keep it up!",
      },
      {
        id: "2",
        name: "Bob Smith",
        amount: 250,
        date: "2024-01-19",
        message: "Proud to support this cause.",
      },
      { id: "3", name: "Carol Davis", amount: 100, date: "2024-01-18" },
      {
        id: "4",
        name: "David Wilson",
        amount: 75,
        date: "2024-01-17",
        message: "Every drop counts!",
      },
    ],
  },
  {
    id: "2",
    name: "Smart Wallet",
    description:
      "Personal Wallets as Smart Contracts for more security and less worries.",
    fullDescription:
      "Smart Wallets are smart contracts that hold your assets. You controll them with your hot account and define your spending limits, inheritance, and subscriptions.",
    category: "Infrastructure",
    totalRaised: 1825.3,
    backers: 18,
    status: "approved",
    creator: "polimartlabs",
    stxAddress: "",
    image:
      "https://images.unsplash.com/photo-1578912084730-23a3182cdf27?w=400&h=250&fit=crop",
    slug: "smart-wallet",
    updates: [
      {
        id: "1",
        title: "New School Building Progress",
        content:
          "Construction of our third school building is 60% complete. We're on track to open by the end of next month!",
        date: "2024-01-12",
      },
    ],
    backersList: [
      {
        id: "1",
        name: "Emma Johnson",
        amount: 300,
        date: "2024-01-16",
        message: "Education changes everything!",
      },
      { id: "2", name: "Frank Miller", amount: 200, date: "2024-01-15" },
    ],
  },
  {
    id: "3",
    name: "Zero Authority DAO",
    description: "A platform created by creators for creators.",
    fullDescription:
      "Our vision is to create a trustless, permissionless gig marketplace for Web3 creators and builders to succeed.",
    category: "funding",
    totalRaised: 3200.45,
    backers: 31,
    status: "approved",
    creator: "Zero",
    stxAddress: "SP2GW18TVQR75W1VT53HYGBRGKFRV5BFYNAF5SS5J", // ZeroAuthorityDAO.btc
    image:
      "https://images.unsplash.com/photo-1725383219768-aecec2f1c1d5?w=400&h=250&fit=crop",
    slug: "zero-authority-dao",
    updates: [
      {
        id: "1",
        title: "Solar Panel Installation Complete",
        content:
          "We've successfully installed 50 solar panels across 10 homes in the community. Families are now enjoying clean, renewable energy!",
        date: "2024-01-18",
      },
    ],
    backersList: [
      {
        id: "1",
        name: "Grace Lee",
        amount: 1000,
        date: "2024-01-20",
        message: "The future is renewable!",
      },
      { id: "2", name: "Henry Brown", amount: 500, date: "2024-01-19" },
    ],
  },
  {
    id: "4",
    name: "TxInfo",
    description: "Add metadata to any blockchain transaction using Nostr.",
    category: "Infrastructure",
    totalRaised: 0,
    backers: 0,
    status: "pending",
    creator: "OpenCollective",
    stxAddress: "",
    image:
      "https://images.unsplash.com/photo-1526841803814-753ac32aa9e2?w=400&h=250&fit=crop",
    slug: "tx-info",
  },
];
