import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  Pressable,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { bookingApi } from '../../api/bookings';
import { Booking } from '../../types';
import Badge from '../../components/Badge';
import Avatar from '../../components/Avatar';
import EmptyState from '../../components/EmptyState';

const statusConfig: Record<string, { label: string }> = {
  PENDING: { label: 'Pending' },
  ACCEPTED: { label: 'Accepted' },
  DECLINED: { label: 'Declined' },
  PAID: { label: 'Paid' },
  COMPLETED: { label: 'Completed' },
  CANCELLED: { label: 'Cancelled' },
};

export default function MyBookingsScreen() {
  const navigation = useNavigation<any>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await bookingApi.getMyBookings();
      setBookings(r.content || []);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load bookings.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (bookingId: number) => {
    try {
      await bookingApi.complete(bookingId);
      Alert.alert('Success', 'Booking marked as completed.');
      load();
    } catch (e: any) {
      Alert.alert(
        'Error',
        e?.response?.data?.message || 'Could not complete booking.',
      );
    }
  };

  const renderItem = ({ item }: { item: Booking }) => {
    const cfg = statusConfig[item.status] || statusConfig.PENDING;
    return (
      <View style={s.card}>
        <View style={s.cardTop}>
          <View style={s.personRow}>
            <Avatar name={item.providerName} uri={item.providerAvatarUrl} size={spacing.space56} />
            <View style={s.personInfo}>
              <Text style={s.name}>{item.providerName}</Text>
              <Text style={s.role}>Professional service provider</Text>
            </View>
          </View>
          <Badge status={item.status} label={cfg.label} />
        </View>

        <Text style={s.serviceTitle}>{item.jobDescription}</Text>
        <Text style={s.serviceBody} numberOfLines={2}>{item.jobDescription}</Text>

        <View style={s.dateBar}>
          <Text style={s.dateText}>{item.preferredDate} at {item.preferredTime}</Text>
        </View>

        {item.declineReason ? <Text style={s.reason}>Reason: {item.declineReason}</Text> : null}

        <View style={s.actionRow}>
          <Pressable
            style={s.secondaryAction}
            onPress={() =>
              navigation.navigate('BookingDetail', {
                bookingId: item.id,
                booking: item,
              })
            }
          >
            <Text style={s.secondaryActionText}>View Details</Text>
          </Pressable>

          {(item.status === 'PENDING' || item.status === 'ACCEPTED') ? (
            <Pressable
              style={s.secondaryAction}
              onPress={() =>
                navigation.navigate('Chat', {
                  bookingId: item.id,
                  otherUserName: item.providerName,
                })
              }
            >
              <Text style={s.secondaryActionText}>Message</Text>
            </Pressable>
          ) : null}

          {item.status === 'ACCEPTED' ? (
            <Pressable
              style={s.primaryAction}
              onPress={() =>
                navigation.navigate('Checkout', {
                  bookingId: item.id,
                  providerName: item.providerName,
                  jobDescription: item.jobDescription,
                  preferredDate: item.preferredDate,
                })
              }
            >
              <Text style={s.primaryActionText}>Pay Now</Text>
            </Pressable>
          ) : null}

          {item.status === 'PAID' ? (
            <Pressable style={s.primaryAction} onPress={() => handleMarkCompleted(item.id)}>
              <Text style={s.primaryActionText}>Mark Completed</Text>
            </Pressable>
          ) : null}

          {item.status === 'COMPLETED' ? (
            <Pressable
              style={s.secondaryAction}
              onPress={() =>
                navigation.navigate('ReviewForm', {
                  bookingId: item.id,
                  providerName: item.providerName,
                })
              }
            >
              <Text style={s.secondaryActionText}>View Receipt</Text>
            </Pressable>
          ) : null}

          {item.status === 'CANCELLED' ? (
            <Pressable style={s.secondaryAction}>
              <Text style={s.secondaryActionText}>Rebook</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surfaceContainerLowest} />
      <View style={s.topBar}>
        <View style={s.topAvatar} />
        <Text style={s.brand}>SkillLink</Text>
        <View style={s.notificationDot} />
      </View>

      <FlatList
        data={bookings}
        renderItem={renderItem}
        keyExtractor={(i) => i.id.toString()}
        contentContainerStyle={s.list}
        ListHeaderComponent={
          <View>
            <Text style={s.title}>My Bookings</Text>
            <Text style={s.subtitle}>Manage your upcoming and past service requests.</Text>
            <View style={s.segmentRow}>
              <View style={s.segmentActive}><Text style={s.segmentActiveText}>Active</Text></View>
              <View style={s.segment}><Text style={s.segmentText}>Completed</Text></View>
              <View style={s.segment}><Text style={s.segmentText}>Cancelled</Text></View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon={loading ? '…' : '⌂'}
            title={loading ? 'Loading...' : 'No bookings yet'}
            subtitle={error || 'Book a service provider to get started.'}
          />
        }
      />
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
  topAvatar: {
    width: spacing.space32,
    height: spacing.space32,
    borderRadius: spacing.space16,
    backgroundColor: colors.surfaceContainer,
  },
  brand: {
    ...typography.h4,
    color: colors.primaryContainer,
  },
  notificationDot: {
    width: spacing.space16,
    height: spacing.space16,
    borderRadius: spacing.space8,
    backgroundColor: colors.notification,
  },
  list: {
    padding: spacing.space20,
    paddingBottom: spacing.navHeight,
  },
  title: {
    ...typography.h2,
    color: colors.onSurface,
  },
  subtitle: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space12,
    marginBottom: spacing.space24,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: spacing.space12,
    marginBottom: spacing.space24,
  },
  segmentActive: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.space24,
    paddingVertical: spacing.space12,
  },
  segmentActiveText: {
    ...typography.button,
    color: colors.onPrimary,
  },
  segment: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.space24,
    paddingVertical: spacing.space12,
  },
  segmentText: {
    ...typography.button,
    color: colors.onSurface,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    padding: spacing.space24,
    marginBottom: spacing.space20,
    borderWidth: spacing.xxs,
    borderColor: colors.surfaceVariant,
    ...shadows.sm,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.space12,
  },
  personRow: {
    flexDirection: 'row',
    gap: spacing.space12,
    flex: 1,
  },
  personInfo: {
    flex: 1,
  },
  name: {
    ...typography.h4,
    color: colors.onSurface,
  },
  role: {
    ...typography.body,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space4,
  },
  serviceTitle: {
    ...typography.h4,
    color: colors.onSurface,
    marginTop: spacing.space20,
  },
  serviceBody: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    marginTop: spacing.space8,
  },
  dateBar: {
    borderRadius: borderRadius.control,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.space12,
    paddingVertical: spacing.space12,
    marginTop: spacing.space16,
  },
  dateText: {
    ...typography.body,
    color: colors.onSurface,
  },
  reason: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.space12,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.space12,
    justifyContent: 'flex-end',
    marginTop: spacing.space20,
  },
  primaryAction: {
    borderRadius: borderRadius.control,
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: spacing.space20,
    paddingVertical: spacing.space14,
  },
  primaryActionText: {
    ...typography.button,
    color: colors.onPrimary,
  },
  secondaryAction: {
    borderRadius: borderRadius.control,
    borderWidth: spacing.xxs,
    borderColor: colors.primary,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.space20,
    paddingVertical: spacing.space14,
  },
  secondaryActionText: {
    ...typography.button,
    color: colors.primary,
  },
});
