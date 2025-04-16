/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

admin.initializeApp();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const createPaymentIntent = functions.https.onCall(async (data) => {
  try {
    console.log('Received request:', data);
    
    if (!data || typeof data !== 'object') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'リクエストデータがありません。'
      );
    }

    const { amount } = data;
    console.log('Amount received:', amount, 'Type:', typeof amount);

    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        '金額は数値で指定してください。'
      );
    }

    if (amount <= 0) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        '金額は0より大きい値を指定してください。'
      );
    }

    // 金額を整数に変換
    const amountInYen = Math.floor(amount);
    console.log('Creating payment intent with amount:', amountInYen);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInYen,
      currency: 'jpy',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('Payment intent created successfully:', paymentIntent.id);

    return {
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      throw new functions.https.HttpsError(
        'aborted',
        `Stripeエラー: ${error.message}`
      );
    }

    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError(
      'internal',
      '支払い意図の作成に失敗しました。'
    );
  }
});
