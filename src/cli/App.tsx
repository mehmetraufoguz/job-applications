
import React, { useState } from 'react';
import { Text } from 'ink';
import SelectInput from 'ink-select-input';
import { AddApplication } from './AddApplication.js';
import { ListApplications } from './ListApplications.js';
import { UpdateApplicationStatus } from './UpdateApplicationStatus.js';

export const App = () => {
	const [screen, setScreen] = useState<'add'|'list'|'update'|null>(null);

	const menuItems = [
		{ label: 'Add Application', value: 'add' },
		{ label: 'List Applications', value: 'list' },
		{ label: 'Update Status', value: 'update' }
	];

	if (screen === 'add') {
		return <AddApplication onDone={() => setScreen(null)} />;
	}
	if (screen === 'list') {
		return <ListApplications onDone={() => setScreen(null)} />;
	}
	if (screen === 'update') {
		return <UpdateApplicationStatus onDone={() => setScreen(null)} />;
	}

	return (
		<SelectInput
			items={menuItems}
			onSelect={item => setScreen(item.value as 'add'|'list'|'update')}
		/>
	);
};
