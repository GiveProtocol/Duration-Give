import React from 'react';
import { WithdrawalForm } from './WithdrawalForm';
import { TransactionModal } from '../common/TransactionModal';

interface WithdrawalModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  onClose,
  onSuccess
}) => {
  return (
    <TransactionModal
      title="Request Withdrawal"
      onClose={onClose}
    >
      <WithdrawalForm
        onSuccess={() => {
          onSuccess?.();
          onClose();
        }}
      />
    </TransactionModal>
  );
};