import React, { useEffect, useRef, useState } from 'react';
import { Text, Box, useInput } from 'ink';
// Removed ink-table
import { orm } from '../db/index.js';
import { jobApplications } from '../db/jobApplications.schema.js';

export const ListApplications = ({ onDone }: { onDone: () => void }) => {
    const [apps, setApps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const exited = useRef(false);

    useEffect(() => {
        (async () => {
            const result = await orm.select().from(jobApplications);
            setApps(result);
            setLoading(false);
        })();
    }, []);

    useInput((input, key) => {
        if (key.escape) {
            onDone();
        }
    });

    if (loading) return <Text>Loading...</Text>;

    if (apps.length === 0) return <Text color="yellow">No applications found. Press [ESC] key to return.</Text>;

    return (
        <>
            <Text>Job Applications List:</Text>
            <Box flexDirection="row">
                <Text bold>ID      </Text>
                <Text bold>Company Name      </Text>
                <Text bold>Platform      </Text>
                <Text bold>Status      </Text>
            </Box>
            {apps.map(app => (
                <Box key={app.id} flexDirection="row">
                    <Text>{String(app.id).padEnd(8)}</Text>
                    <Text>{app.companyName.padEnd(16)}</Text>
                    <Text>{app.platform.padEnd(12)}</Text>
                    <Text>{app.status.padEnd(10)}</Text>
                </Box>
            ))}
            <Text color="cyan">Press [ESC] key to return.</Text>
        </>
    );
};
