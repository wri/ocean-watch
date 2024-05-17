import { useState, useCallback, MouseEvent, KeyboardEvent } from 'react';

// types
import type { Resource } from 'types/collection';
import type { RESOURCE_TYPES, ANY_RESOURCE } from 'types';

export interface CollectionsPanelProps {
  resource: ANY_RESOURCE;
  resourceType: RESOURCE_TYPES;
  onKeyPress?: (evt: KeyboardEvent<HTMLDivElement>) => void;
  onClick?: (evt: MouseEvent<HTMLDivElement>) => void;
  onToggleFavorite?: (isFavorite: boolean, resource: ANY_RESOURCE) => void;
  onToggleCollection?: (isAdded: boolean, resource: Resource) => void;
}

const CollectionsPanel = ({
  resource,
  resourceType,
  onKeyPress,
  onClick,
  onToggleFavorite,
  onToggleCollection,
}: CollectionsPanelProps): JSX.Element => {
  const [newCollectionState, setNewCollectionState] = useState({
    newCollectionName: '',
  });

  const handleInputChange = useCallback((evt) => {
    setNewCollectionState({
      newCollectionName: evt.currentTarget.value,
    });
  }, []);

  return (
    <div
      className="c-collections-panel"
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        }
      }}
      onKeyPress={(e) => {
        if (onKeyPress) {
          onKeyPress(e);
        }
      }}
    >
      <div className="new-collection-container">
        <input
          type="text"
          name="new-collection"
          className="new-collection-input"
          placeholder="New collection"
          onChange={handleInputChange}
        />
        <button type="button" className="c-button add-button">
          Add
        </button>
      </div>
    </div>
  );
};

export default CollectionsPanel;
