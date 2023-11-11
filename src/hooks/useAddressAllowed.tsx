import { useState } from 'react';

import { usePolling } from './usePolling';

export interface AddressAllowedResult {
  isAllowed: boolean;
}

const ONE_HOUR = 12 * 60 * 60 * 1000;

export interface TRMScreeningResponse {
  address: string;
  isSanctioned: boolean;
}

export const useAddressAllowed = (address: string): AddressAllowedResult => {
  const [isAllowed, setIsAllowed] = useState(true);

  const TRM_URL = 'https://api.trmlabs.com/public/v1/sanctions/screening';

  const getIsAddressAllowed = async () => {
    if (TRM_URL && address) {
      try {
        const body = JSON.stringify([{ address: address }]);

        const response = await fetch(TRM_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        });

        if (response.ok) {
          const data: { isSanctioned: boolean } = await response.json();
          setIsAllowed(!data.isSanctioned);
        } else {
          console.error('Response not OK:', response.status, await response.text());
        }
      } catch (e) {
        console.error('Error:', e);
      }
    } else {
      setIsAllowed(true);
    }
  };

  usePolling(getIsAddressAllowed, ONE_HOUR, false, [address]);

  return {
    isAllowed,
  };
};
