
import { useEffect, useState } from 'react';
import { Text, Box, useInput } from 'ink';
import { Form } from 'ink-form';
import { sql } from 'drizzle-orm';

import { orm } from '../db/index.js';
import { jobApplications } from '../db/jobApplications.schema.js';
import { QuickSearchInput } from './QuickSearchInput.js';
import { STATUS_OPTIONS as BASE_STATUS_OPTIONS } from './AddApplication.js';

// Append Delete option to status dropdown
const STATUS_OPTIONS = [
    ...BASE_STATUS_OPTIONS,
    { label: 'Delete', value: 'delete' }
];

export const UpdateApplicationStatus = ({ onDone }: { onDone: () => void }) => {
    type JobApplication = {
        id: number;
        companyName: string;
        link: string;
        platform: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    };

    const [apps, setApps] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string>('');
    const [newStatus, setNewStatus] = useState('');
    const [step, setStep] = useState(0);
    const [updated, setUpdated] = useState(false);

    useEffect(() => {
        (async () => {
            const result = await orm.select().from(jobApplications);
            setApps(result);
            setLoading(false);
        })();
    }, []);

    const handleUpdate = async (status: string) => {
        await orm.update(jobApplications)
            .set({ status, updatedAt: new Date() })
            .where(sql`id = ${Number(selectedId)}`);
        setUpdated(true);
        setTimeout(onDone, 1500);
    };


    const handleDelete = async () => {
        await orm.delete(jobApplications)
            .where(sql`id = ${Number(selectedId)}`);
        setUpdated(true);
        setTimeout(onDone, 1500);
    };

    useInput((input, key) => {
        if (key.escape) {
            onDone();
        }
    });

    if (loading) return <Text>Loading...</Text>;
    if (updated) return <Text color="green">Status updated!</Text>;

    if (apps.length === 0) return <Text color="yellow">No applications found. Press [ESC] key to return.</Text>;

    return (
        <Box flexDirection="column">
            {step === 0 && (
                <Box flexDirection="column">
                    <Text>Select Application to update:</Text>
                    <QuickSearchInput
                        items={apps.map(app => ({
                            label: `ID: ${app.id} | ${app.companyName} | Status: ${app.status}`,
                            value: String(app.id)
                        }))}
                        onSelect={(item) => {
                            if (item.value !== undefined) {
                                setSelectedId(String(item.value));
                                setStep(1);
                            }
                        }}
                    />
                </Box>
            )}
            {step === 1 && (
                <Box flexDirection="column">
                    <Form
                        form={{
                            sections: [
                                {
                                    title: 'Update Status',
                                    fields: [
                                        {
                                            name: 'status',
                                            label: 'New Status',
                                            type: 'select',
                                            options: STATUS_OPTIONS,
                                            required: true,
                                            initialValue: newStatus || 'pending'
                                        }
                                    ]
                                }
                            ]
                        }}
                        onSubmit={(values) => {
                            const status = (values as { status: string }).status;
                            if (status === 'delete') {
                                handleDelete();
                            } else {
                                handleUpdate(status);
                            }
                        }}
                    />
                </Box>
            )}
        </Box>
    );
};
