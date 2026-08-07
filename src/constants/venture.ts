import { Bike, ShieldCheck, Store, Users } from "lucide-react";
import type { Venture } from "@/types";

/**
 * Velobite — the startup currently in active development.
 *
 * Repository names and counts come from the `velobite` GitHub organisation; the
 * architecture and security notes come from the `velobite_be_user_app` README
 * and `pom.xml`. All eight repositories are private, so nothing here links to
 * source — only the organisation itself.
 */
export const VENTURE: Venture = {
  name: "Velobite",
  status: "In active development",
  tagline: "A food-delivery platform built as eight services, not one app.",
  summary:
    "Four separate products — customer, restaurant, delivery partner and admin — each with its own TypeScript frontend and its own backend service. Splitting by audience rather than by layer means a restaurant owner's release cannot break a courier's app, and each surface gets an API shaped for what it actually does instead of one endpoint trying to serve four very different clients.",
  period: "Jul 2026 — Present",
  org: "velobite",
  orgUrl: "https://github.com/velobite",
  teamSize: "2 engineers",
  repoCount: 8,

  surfaces: [
    {
      name: "Customer app",
      audience: "Diners",
      description:
        "Ordering, checkout and live order tracking. The only surface with a public sign-up path, and the one the authentication service was designed around.",
      frontendRepo: "velobite_fe_user_app",
      backendRepo: "velobite_be_user_app",
      icon: Users,
    },
    {
      name: "Restaurant app",
      audience: "Restaurant owners",
      description:
        "Menu and catalogue management, incoming order queue, availability and fulfilment state.",
      frontendRepo: "velobite_fe_restaurent_app",
      backendRepo: "velobite_be_restaurant_app",
      icon: Store,
    },
    {
      name: "Delivery partner app",
      audience: "Couriers",
      description:
        "Assignment, acceptance and delivery status updates — the surface that has to stay usable on a phone, one-handed, outdoors.",
      frontendRepo: "velobite_fe_deliveryPartner_app",
      backendRepo: "velobite_be_deliveryPartner_app",
      icon: Bike,
    },
    {
      name: "Admin console",
      audience: "Platform operators",
      description:
        "Oversight across the whole platform — restaurants, couriers, customers and the orders moving between them.",
      frontendRepo: "velobite_fe_admin_app",
      backendRepo: "velobite_be_admin_app",
      icon: ShieldCheck,
    },
  ],

  /** Drawn from the auth service's design notes — the decisions worth defending. */
  decisions: [
    {
      title: "The account does not exist until the code is verified",
      body: "Sign-up parks the details in a verifications table with the password already hashed, and only writes to users once the OTP is confirmed. An unverified phone number can never reach a courier.",
    },
    {
      title: "Password reset goes to the verified mobile, never to email",
      body: "Email is not confirmed at sign-up, so using it for recovery would let a single typo hand account access to a stranger.",
    },
    {
      title: "Reset cannot enumerate accounts",
      body: "An unknown identifier still receives a verification id and an identical response shape — a decoy whose code simply never matches. There is no observable difference between a real account and a fake one.",
    },
    {
      title: "Failed-attempt counters commit independently",
      body: "A rejection ends by throwing, which rolls the caller's transaction back. Recording attempts in a REQUIRES_NEW transaction is the only reason the login lockout and OTP attempt limit are reachable at all.",
    },
    {
      title: "Google sends an ID token, not a profile",
      body: "Trusting a client-supplied profile would let anyone claim any email address and be handed the account. The service takes the ID token and verifies it against Google's own signing keys.",
    },
    {
      title: "One error envelope, mapped to form fields",
      body: "Every response uses the same shape, and each error carries a field name matching the client's AuthField union — so a failed request maps straight onto the form that caused it rather than becoming a generic toast.",
    },
  ],

  stack: [
    {
      label: "Backend",
      items: [
        "Java 17",
        "Spring Boot 3.4",
        "Spring Security",
        "JPA",
        "PostgreSQL",
        "Flyway",
        "JJWT",
        "Google API Client",
      ],
    },
    { label: "Frontend", items: ["TypeScript", "React"] },
    {
      label: "Platform",
      items: ["Docker Compose", "Embedded Postgres tests", "E.164 phone identity", "OTP + JWT"],
    },
  ],
};

/** Headline numbers for the section's stat strip. */
export const VENTURE_STATS = [
  { value: 8, label: "Services in the org" },
  { value: 4, label: "Product surfaces" },
  { value: 10, label: "Auth endpoints" },
  { value: 2, label: "Engineers" },
];
