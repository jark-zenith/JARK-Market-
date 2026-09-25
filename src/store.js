import {seedListings,seedOrders,seedMessages} from './data';

const KEY='jark-market-state-v2';
const initial={user:null,role:'customer',favorites:[],cart:[],orders:seedOrders,messages:seedMessages,listings:seedListings,notifications:2};

function load(){try{return {...initial,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return initial}}
let state=load();
const listeners=new Set();

export function getState(){return state}
export function subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)}
function persist(){localStorage.setItem(KEY,JSON.stringify(state));listeners.forEach(fn=>fn(state))}
export function login(role='customer'){
 const names={customer:'Jark Customer',provider:'JARK Provider',admin:'JARK Admin'};
 state={...state,user:{name:names[role]||names.customer,email:`${role}@jarkmarket.demo`},role};
 persist();
}
export function logout(){state={...state,user:null,role:'customer'};persist()}
export function toggleFavorite(id){state={...state,favorites:state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id]};persist()}
export function addToCart(id){if(!state.cart.includes(id))state={...state,cart:[...state.cart,id]};persist()}
export function removeFromCart(id){state={...state,cart:state.cart.filter(x=>x!==id)};persist()}
export function createOrder(listing,payment='M-Pesa'){
 const order={id:`JM-${10000+state.orders.length+1}`,listingId:listing.id,title:listing.title,provider:listing.seller,customer:state.user?.name||'Guest Customer',amount:listing.price,status:'Confirmed',date:new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}),payment,kind:'service'};
 state={...state,orders:[order,...state.orders],cart:state.cart.filter(id=>id!==listing.id)};
 persist();return order;
}
export function addListing(form){const listing={...form,id:`svc-${Date.now()}`,rating:0,reviews:0,verified:false,tag:'New'};state={...state,listings:[listing,...state.listings]};persist();return listing}
export function sendMessage(from,textValue){const msg={id:`m-${Date.now()}`,from,preview:textValue,time:new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),unread:false};state={...state,messages:[msg,...state.messages]};persist()}
export function clearNotifications(){state={...state,notifications:0};persist()}