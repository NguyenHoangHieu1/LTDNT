'use client';

import { useLocalSearchParams } from 'expo-router';
import ComponentForm from '~/components/admin/ComponentForm';
import type { ComponentType } from '~/data/pcComponents';

const AddComponentScreen = () => {
  const { type } = useLocalSearchParams<{ type: ComponentType }>();

  return <ComponentForm componentType={type} isEditing={false} />;
};

export default AddComponentScreen;
