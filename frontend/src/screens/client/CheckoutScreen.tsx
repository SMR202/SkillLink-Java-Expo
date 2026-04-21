import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, StatusBar, ScrollView, Alert } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { paymentApi } from '../../api/payments';
import GradientButton from '../../components/GradientButton';

export default function CheckoutScreen({ route, navigation }: any) {
  const { bookingId, providerName, jobDescription, preferredDate } = route.params || {};
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [amount, setAmount] = useState('5000');
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);

  const formatCard = (val: string) => {
    const nums = val.replace(/\D/g, '').slice(0, 16);
    return nums.replace(/(\d{4})(?=\d)/g, '$1 ');
  };
  const formatExpiry = (val: string) => {
    const nums = val.replace(/\D/g, '').slice(0, 4);
    return nums.length > 2 ? nums.slice(0, 2) + '/' + nums.slice(2) : nums;
  };

  const isValid = cardNumber.replace(/\s/g, '').length === 16 && expiry.length === 5 && cvv.length >= 3 && Number(amount) > 0;

  const handlePay = async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      const res = await paymentApi.checkout({
        bookingId,
        paymentMethod: 'CARD',
        paymentToken: 'tok_' + cardNumber.replace(/\s/g, '').slice(-4),
        amount: Number(amount),
      });
      setReceipt(res.data?.data);
    } catch (e: any) {
      Alert.alert('Payment Failed', e.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  if (receipt) {
    const fee = Number(receipt.platformFee || 0);
    return (
      <View style={s.container}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={s.successWrap}>
          <Text style={{ fontSize: 56 }}>🎉</Text>
          <Text style={s.successTitle}>Payment Successful!</Text>
          <View style={s.receiptCard}>
            <Text style={s.receiptHead}>Receipt</Text>
            <View style={s.receiptRow}><Text style={s.receiptLabel}>Transaction</Text><Text style={s.receiptVal}>{receipt.transactionRef}</Text></View>
            <View style={s.receiptRow}><Text style={s.receiptLabel}>Provider</Text><Text style={s.receiptVal}>{receipt.providerName}</Text></View>
            <View style={s.receiptRow}><Text style={s.receiptLabel}>Amount</Text><Text style={s.receiptVal}>PKR {Number(receipt.amount).toLocaleString()}</Text></View>
            <View style={s.receiptRow}><Text style={s.receiptLabel}>Platform Fee</Text><Text style={s.receiptVal}>PKR {fee.toLocaleString()}</Text></View>
            <View style={[s.receiptRow, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md }]}>
              <Text style={[s.receiptLabel, { fontWeight: '700' }]}>Total Paid</Text>
              <Text style={[s.receiptVal, { fontWeight: '700', color: colors.accent }]}>PKR {Number(receipt.amount).toLocaleString()}</Text>
            </View>
            <View style={[s.statusBadge, { backgroundColor: '#D1FAE5' }]}>
              <Text style={{ color: colors.accent, fontWeight: '600', fontSize: 13 }}>✓ COMPLETED</Text>
            </View>
          </View>
          <GradientButton title="Back to Bookings" onPress={() => navigation.goBack()} style={{ width: '100%', marginTop: spacing.xl }} />
        </ScrollView>
      </View>
    );
  }

  const numAmount = Number(amount) || 0;
  const platformFee = Math.round(numAmount * 0.1);

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" />
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()}><Text style={s.back}>← Back</Text></Pressable>
        <Text style={s.title}>Checkout</Text>
      </View>
      <ScrollView contentContainerStyle={s.content}>
        {/* Booking Summary */}
        <View style={s.summaryCard}>
          <Text style={s.summaryTitle}>Booking Summary</Text>
          <View style={s.summaryRow}><Text style={s.sumLabel}>Provider</Text><Text style={s.sumVal}>{providerName}</Text></View>
          <View style={s.summaryRow}><Text style={s.sumLabel}>Date</Text><Text style={s.sumVal}>{preferredDate}</Text></View>
          <View style={s.summaryRow}><Text style={s.sumLabel}>Description</Text><Text style={s.sumVal} numberOfLines={2}>{jobDescription}</Text></View>
        </View>

        {/* Amount */}
        <Text style={s.label}>Service Amount (PKR)</Text>
        <TextInput style={s.input} value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="5000" placeholderTextColor={colors.textMuted} />

        <View style={s.feeBreakdown}>
          <View style={s.feeRow}><Text style={s.feeLabel}>Service Fee</Text><Text style={s.feeVal}>PKR {numAmount.toLocaleString()}</Text></View>
          <View style={s.feeRow}><Text style={s.feeLabel}>Platform Fee (10%)</Text><Text style={s.feeVal}>PKR {platformFee.toLocaleString()}</Text></View>
          <View style={[s.feeRow, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md }]}>
            <Text style={[s.feeLabel, { fontWeight: '700', color: colors.textPrimary }]}>Total</Text>
            <Text style={[s.feeVal, { fontWeight: '700', color: colors.accent }]}>PKR {numAmount.toLocaleString()}</Text>
          </View>
        </View>

        {/* Card Input */}
        <Text style={[s.label, { marginTop: spacing.xl }]}>Card Details</Text>
        <View style={s.cardInputWrap}>
          <TextInput style={s.cardInput} placeholder="4242 4242 4242 4242" placeholderTextColor={colors.textMuted} value={cardNumber} onChangeText={t => setCardNumber(formatCard(t))} keyboardType="numeric" maxLength={19} />
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <TextInput style={[s.cardInput, { flex: 1 }]} placeholder="MM/YY" placeholderTextColor={colors.textMuted} value={expiry} onChangeText={t => setExpiry(formatExpiry(t))} keyboardType="numeric" maxLength={5} />
            <TextInput style={[s.cardInput, { flex: 1 }]} placeholder="CVV" placeholderTextColor={colors.textMuted} value={cvv} onChangeText={t => setCvv(t.replace(/\D/g, '').slice(0, 4))} keyboardType="numeric" maxLength={4} secureTextEntry />
          </View>
        </View>
        <Text style={s.hint}>Use test card: 4242 4242 4242 4242</Text>

        <GradientButton
          title={`Pay PKR ${numAmount.toLocaleString()}`}
          onPress={handlePay}
          loading={loading}
          disabled={!isValid}
          variant="accent"
          style={{ marginTop: spacing.xl }}
        />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSecondary },
  header: { backgroundColor: colors.bgPrimary, paddingTop: 54, paddingHorizontal: spacing.xxl, paddingBottom: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { ...typography.small, color: colors.accent, marginBottom: spacing.sm },
  title: { ...typography.h2, color: colors.textPrimary },
  content: { padding: spacing.xxl, paddingBottom: 100 },
  summaryCard: { backgroundColor: colors.bgCard, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xl, ...shadows.sm },
  summaryTitle: { ...typography.bodyMedium, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  sumLabel: { ...typography.small, color: colors.textMuted },
  sumVal: { ...typography.small, color: colors.textPrimary, fontWeight: '500', flex: 1, textAlign: 'right' },
  label: { ...typography.bodyMedium, color: colors.textPrimary, fontWeight: '600', marginBottom: spacing.sm },
  input: { backgroundColor: colors.bgInput, borderRadius: borderRadius.md, padding: spacing.lg, ...typography.body, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border },
  feeBreakdown: { backgroundColor: colors.bgCard, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, marginTop: spacing.lg, ...shadows.sm },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  feeLabel: { ...typography.small, color: colors.textMuted },
  feeVal: { ...typography.small, color: colors.textPrimary, fontWeight: '500' },
  cardInputWrap: { gap: spacing.md },
  cardInput: { backgroundColor: colors.bgInput, borderRadius: borderRadius.md, padding: spacing.lg, ...typography.body, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border },
  hint: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  successWrap: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl },
  successTitle: { ...typography.h2, color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.xl },
  receiptCard: { backgroundColor: colors.bgCard, borderRadius: borderRadius.lg, padding: spacing.xl, borderWidth: 1, borderColor: colors.border, width: '100%', ...shadows.md },
  receiptHead: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.lg, textAlign: 'center' },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  receiptLabel: { ...typography.small, color: colors.textMuted },
  receiptVal: { ...typography.small, color: colors.textPrimary, fontWeight: '500' },
  statusBadge: { alignSelf: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.full, marginTop: spacing.lg },
});
