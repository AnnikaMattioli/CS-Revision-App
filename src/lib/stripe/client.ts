import "server-only";
import Stripe from "stripe";
import { getStripeConfig } from "./config";

let client: Stripe | undefined;
export function getStripe(){ return client ??= new Stripe(getStripeConfig().STRIPE_SECRET_KEY,{appInfo:{name:"Bytewise Revision",version:"0.1.0"}}); }
