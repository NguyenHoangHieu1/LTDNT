import { useLocalSearchParams } from 'expo-router';
import ComponentForm from '~/components/admin/ComponentForm';
import type { ComponentType } from '~/data/pcComponents';

const EditComponentScreen = () => {
  const { id, type } = useLocalSearchParams<{ id: string; type: ComponentType }>();

  return <ComponentForm componentType={type} componentId={id} isEditing={true} />;
};

export default EditComponentScreen;
