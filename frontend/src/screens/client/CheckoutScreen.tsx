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
    return nums.length > 2 ? `${nums.slice(0, 2)}/${nums.slice(2)}` : nums;
  };

  const isValid = cardNumber.replace(/\s/g, '').length === 16 && expiry.length === 5 && cvv.length >= 3 && Number(amount) > 0;

  const handlePay = async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      const res = await paymentApi.checkout({
        bookingId,
        paymentMethod: 'CARD',
        paymentToken: `tok_${cardNumber.replace(/\s/g, '').slice(-4)}`,
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
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <ScrollView contentContainerStyle={s.successWrap} showsVerticalScrollIndicator={false}>
          <View style={s.successBadge}>
            <Text style={s.successBadgeText}>✓</Text>
          </View>
          <Text style={s.successTitle}>Payment Successful!</Text>
          <Text style={s.successSubtitle}>Your booking is now confirmed.</Text>

          <View style={s.receiptCard}>
            <Text style={s.receiptTitle}>Receipt</Text>
            <View style={s.receiptRow}><Text style={s.receiptLabel}>Transaction</Text><Text style={s.receiptValue}>{receipt.transactionRef}</Text></View>
            <View style={s.receiptRow}><Text style={s.receiptLabel}>Provider</Text><Text style={s.receiptValue}>{receipt.providerName}</Text></View>
            <View style={s.receiptRow}><Text style={s.receiptLabel}>Amount</Text><Text style={s.receiptValue}>PKR {Number(receipt.amount).toLocaleString()}</Text></View>
            <View style={s.receiptRow}><Text style={s.receiptLabel}>Platform Fee</Text><Text style={s.receiptValue}>PKR {fee.toLocaleString()}</Text></View>
            <View style={s.receiptDivider} />
            <View style={s.receiptRow}><Text style={s.receiptTotalLabel}>Total Paid</Text><Text style={s.receiptTotalValue}>PKR {Number(receipt.amount).toLocaleString()}</Text></View>
          </View>

          <GradientButton title="Back to Bookings" onPress={() => navigation.goBack()} style={s.fullButton} />
        </ScrollView>
      </View>
    );
  }

  const numAmount = Number(amount) || 0;
  const platformFee = Math.round(numAmount * 0.1);
  const taxes = Math.round(numAmount * 0.05);
  const totalDue = numAmount + platformFee + taxes;

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surfaceContainerLowest} />
      <View style={s.topBar}>
        <Pressable onPress={() => navigation.goBack()}><Text style={s.back}>←</Text></Pressable>
        <Text style={s.brand}>SkillLink</Text>
        <Text style={s.lock}>🔒</Text>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Complete your booking</Text>
        <Text style={s.subtitle}>Review your details and confirm payment.</Text>

        <View style={s.card}>
          <Text style={s.cardTitle}>Payment Method</Text>
          <View style={s.paymentRow}>
            <View style={s.paymentOptionActive}>
              <Text style={s.paymentBrand}>VISA</Text>
              <View>
                <Text style={s.paymentNumber}>•••• 4242</Text>
                <Text style={s.paymentMeta}>Expires 12/25</Text>
              </View>
            </View>
            <View style={s.paymentOption}>
              <Text style={s.paymentAdd}>+</Text>
              <Text style={s.paymentMeta}>Add New Card</Text>
            </View>
          </View>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Booking Summary</Text>
          <Text style={s.summaryService}>{jobDescription || 'Strategic UX Consulting'}</Text>
          <Text style={s.summaryProvider}>with {providerName}</Text>
          <Text style={s.summaryDate}>{preferredDate}</Text>

          <View style={s.summaryDivider} />

          <Text style={s.fieldLabel}>Service Amount (PKR)</Text>
          <TextInput style={s.input} value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="5000" placeholderTextColor={colors.outline} />

          <Text style={s.fieldLabel}>Card Details</Text>
          <TextInput style={s.input} placeholder="4242 4242 4242 4242" placeholderTextColor={colors.outline} value={cardNumber} onChangeText={(t) => setCardNumber(formatCard(t))} keyboardType="numeric" maxLength={19} />
          <View style={s.inlineFields}>
            <TextInput style={[s.input, s.halfInput]} placeholder="MM/YY" placeholderTextColor={colors.outline} value={expiry} onChangeText={(t) => setExpiry(formatExpiry(t))} keyboardType="numeric" maxLength={5} />
            <TextInput style={[s.input, s.halfInput]} placeholder="CVV" placeholderTextColor={colors.outline} value={cvv} onChangeText={(t) => setCvv(t.replace(/\D/g, '').slice(0, 4))} keyboardType="numeric" maxLength={4} secureTextEntry />
          </View>

          <View style={s.summaryDivider} />

          <View style={s.summaryRow}><Text style={s.summaryLabel}>Subtotal</Text><Text style={s.summaryValue}>PKR {numAmount.toLocaleString()}</Text></View>
          <View style={s.summaryRow}><Text style={s.summaryLabel}>Service Fee</Text><Text style={s.summaryValue}>PKR {platformFee.toLocaleString()}</Text></View>
          <View style={s.summaryRow}><Text style={s.summaryLabel}>Taxes</Text><Text style={s.summaryValue}>PKR {taxes.toLocaleString()}</Text></View>

          <View style={s.summaryDivider} />

          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Total Due</Text>
            <Text style={s.totalValue}>PKR {totalDue.toLocaleString()}</Text>
          </View>

          <GradientButton
            title="Confirm & Pay"
            onPress={handlePay}
            loading={loading}
            disabled={!isValid}
            style={s.fullButton}
          />

          <Text style={s.legal}>By confirming you agree to our Terms of Service and Cancellation Policy.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.space24,
    paddingTop: spacing.space48,
    paddingBottom: spacing.space20,
    borderBottomWidth: spacing.xxs,
    borderBottomColor: colors.surfaceVariant,
  },
  back: {
    ...typography.h4,
    color: colors.onSurface,
  },
  brand: {
    ...typography.h4,
    color: colors.primaryContainer,
  },
  lock: {
    ...typography.body,
    color: colors.success,
  },
  content: {
    paddingHorizontal: spacing.space24,
    paddingTop: spacing.space24,
    paddingBottom: spacing.space80,
  },
  title: {
    ...typography.h2,
    color: colors.onSurface,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.space12,
    marginBottom: spacing.space32,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    padding: spacing.space24,
    marginBottom: spacing.space24,
    ...shadows.sm,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.onSurface,
    marginBottom: spacing.space16,
  },
  paymentRow: {
    flexDirection: 'row',
    gap: spacing.space12,
  },
  paymentOptionActive: {
    flex: 1,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.primary,
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.space16,
    flexDirection: 'row',
    gap: spacing.space12,
    alignItems: 'center',
  },
  paymentOption: {
    width: spacing.space96 + spacing.space12,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
    padding: spacing.space16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentBrand: {
    ...typography.captionMedium,
    color: colors.primary,
  },
  paymentNumber: {
    ...typography.bodyMedium,
    color: colors.onSurface,
  },
  paymentMeta: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space4,
  },
  paymentAdd: {
    ...typography.h4,
    color: colors.onSurfaceVariant,
  },
  summaryService: {
    ...typography.h4,
    color: colors.onSurface,
  },
  summaryProvider: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space4,
  },
  summaryDate: {
    ...typography.caption,
    color: colors.secondary,
    marginTop: spacing.space12,
  },
  summaryDivider: {
    height: spacing.xxs,
    backgroundColor: colors.surfaceVariant,
    marginVertical: spacing.space20,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.onSurface,
    marginBottom: spacing.space8,
  },
  input: {
    minHeight: spacing.buttonHeight,
    borderRadius: borderRadius.control,
    borderWidth: spacing.xxs,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.space16,
    paddingVertical: spacing.space14,
    ...typography.body,
    color: colors.onSurface,
    marginBottom: spacing.space16,
  },
  inlineFields: {
    flexDirection: 'row',
    gap: spacing.space12,
  },
  halfInput: {
    flex: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.space12,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.onSurfaceVariant,
  },
  summaryValue: {
    ...typography.body,
    color: colors.onSurface,
  },
  totalRow: {
    marginBottom: spacing.space20,
  },
  totalLabel: {
    ...typography.label,
    color: colors.onSurface,
  },
  totalValue: {
    ...typography.h2,
    color: colors.primaryContainer,
    marginTop: spacing.space8,
  },
  fullButton: {
    width: '100%',
  },
  legal: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.space16,
  },
  successWrap: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.space24,
    paddingVertical: spacing.space48,
  },
  successBadge: {
    width: spacing.space80,
    height: spacing.space80,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.space20,
  },
  successBadgeText: {
    ...typography.h3,
    color: colors.primary,
  },
  successTitle: {
    ...typography.h2,
    color: colors.onSurface,
    textAlign: 'center',
  },
  successSubtitle: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.space8,
    marginBottom: spacing.space24,
  },
  receiptCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    padding: spacing.space24,
    ...shadows.md,
  },
  receiptTitle: {
    ...typography.h3,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.space20,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.space12,
    marginBottom: spacing.space12,
  },
  receiptLabel: {
    ...typography.body,
    color: colors.onSurfaceVariant,
  },
  receiptValue: {
    ...typography.body,
    color: colors.onSurface,
    flexShrink: 1,
    textAlign: 'right',
  },
  receiptDivider: {
    height: spacing.xxs,
    backgroundColor: colors.surfaceVariant,
    marginVertical: spacing.space12,
  },
  receiptTotalLabel: {
    ...typography.label,
    color: colors.onSurface,
  },
  receiptTotalValue: {
    ...typography.h4,
    color: colors.primaryContainer,
  },
});
