import { IconButton, Menu, MenuTrigger } from '@/components';
import { COLORS } from '@/constants';
import type { DraftNote } from '@/types';
import { useState, type Dispatch, type ReactNode } from 'react';
import BackgroundMenu from '../../BackgroundMenu';
import type { NoteAction } from '../reducer';
import EditLabelsMenu from './EditLabelsMenu';

interface MoreMenuProps {
  state: DraftNote;
  dispatch: Dispatch<NoteAction>;
  children: ReactNode;
}

const MoreMenu = ({ state, dispatch, children }: MoreMenuProps) => {
  const [isEditLabel, setIsEditLabel] = useState(false);

  return (
    <MenuTrigger
      onOpenChange={(isOpen) => {
        if (!isOpen) setIsEditLabel(false);
      }}
      menu={
        isEditLabel ? (
          <EditLabelsMenu state={state} dispatch={dispatch} />
        ) : (
          <Menu
            items={[
              {
                label: 'Add label',
                action: () => setIsEditLabel(true),
              },
            ]}
          />
        )
      }
    >
      {children}
    </MenuTrigger>
  );
};

interface CreateToolbarProps {
  state: DraftNote;
  dispatch: Dispatch<NoteAction>;
}

const CreateToolbar = ({ state, dispatch }: CreateToolbarProps) => (
  <div className="-m-2 mt-0 flex items-center gap-x-2">
    <MenuTrigger
      menu={
        <BackgroundMenu
          colors={COLORS}
          selectedColorId={state.colorId}
          onColorClick={(color) => dispatch({ type: 'SET_COLOR', payload: color })}
        />
      }
    >
      <IconButton
        className="p-2"
        iconClassName="text-neutral-300"
        label="Background options"
        iconName="palette"
      />
    </MenuTrigger>
    <IconButton
      className="p-2"
      iconClassName="text-neutral-300"
      label="Archive"
      iconName="archive"
      onClick={() => dispatch({ type: 'SET_ARCHIVED', payload: true })}
    />
    <MoreMenu state={state} dispatch={dispatch}>
      <IconButton
        className="p-2"
        iconClassName="text-neutral-300"
        label="More"
        iconName="more_vert"
      />
    </MoreMenu>
  </div>
);

export default CreateToolbar;
