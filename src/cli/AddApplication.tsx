
import React from 'react';
import { Text, useInput } from 'ink';
import { Form, FormStructure } from 'ink-form';
import { orm } from '../db/index.js';
import { jobApplications } from '../db/jobApplications.schema.js';

const PLATFORM_OPTIONS = [
    { label: 'LinkedIn', value: 'linkedin' },
    { label: 'Indeed', value: 'indeed' },
    { label: 'Company Website', value: 'company_website' },
    { label: 'Other', value: 'other' }
];

export const STATUS_OPTIONS = [
    { label: 'Pending', value: 'pending' },
    { label: 'Interview', value: 'interview' },
    { label: 'Accepted', value: 'accepted' },
    { label: 'Rejected', value: 'rejected' }
];

export const AddApplication = ({ onDone }: { onDone: () => void }) => {

    const formConfig: FormStructure = {
        sections: [
            {
                title: 'Application Info',
                fields: [
                    { name: 'companyName', label: 'Company Name', required: true, type: 'string' },
                    { name: 'link', label: 'Link', required: true, type: 'string' },
                    {
                        name: 'platform',
                        label: 'Platform',
                        required: true,
                        type: 'select',
                        options: PLATFORM_OPTIONS
                    },
                    {
                        name: 'status',
                        label: 'Status',
                        required: false,
                        initialValue: 'pending',
                        type: 'select',
                        options: STATUS_OPTIONS
                    }
                ]
            }
        ]
    };

    const handleSubmit = async (values: any) => {
        await orm.insert(jobApplications).values({
            ...values,
        });
        onDone();
    };

    useInput((input, key) => {
        if (key.escape) {
            onDone();
        }
    });

    return (
        <Form form={formConfig} onSubmit={handleSubmit} />
    );
};
