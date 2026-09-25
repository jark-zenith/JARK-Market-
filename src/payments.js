export const PAYMENT_MODES={
 'M-Pesa':{id:'mpesa',label:'M-Pesa',description:'Kenya mobile money',live:false},
 'Card':{id:'card',label:'Card',description:'Visa / Mastercard adapter',live:false},
 'Pay on arrangement':{id:'arrangement',label:'Pay on arrangement',description:'Customer and provider settle directly',live:false}
};

export function getPaymentMethod(name){return PAYMENT_MODES[name]||PAYMENT_MODES['M-Pesa']}
export function createDemoTransaction({amount,method}){return{transactionId:`DEMO-${Date.now()}`,amount,method,status:'demo_pending',createdAt:new Date().toISOString()}}
export function paymentReady(){return false}
