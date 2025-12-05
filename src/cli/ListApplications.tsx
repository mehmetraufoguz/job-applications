import React, { useEffect, useRef, useState } from 'react';
import { Text, Box, useInput } from 'ink';
// Removed ink-table
import { orm } from '../db/index.js';
import { jobApplications } from '../db/jobApplications.schema.js';
import { desc } from 'drizzle-orm';

export const ListApplications = ({ onDone }: { onDone: () => void }) => {
    const [apps, setApps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const ITEMS_PER_PAGE = 8;
    const exited = useRef(false);

    useEffect(() => {
        (async () => {
            const result = await orm
                .select()
                .from(jobApplications)
                .orderBy(desc(jobApplications.updatedAt));
            setApps(result);
            setLoading(false);
        })();
    }, []);

    useInput((input, key) => {
        if (key.escape) {
            onDone();
        }
        if (key.leftArrow) {
            setPage(p => Math.max(0, p - 1));
        }
        if (key.rightArrow) {
            setPage(p => Math.min(Math.ceil(apps.length / ITEMS_PER_PAGE) - 1, p + 1));
        }
    });

    if (loading) return <Text>Loading...</Text>;

    if (apps.length === 0) return <Text color="yellow">No applications found. Press [ESC] key to return.</Text>;

    // Pagination logic
    const totalPages = Math.max(1, Math.ceil(apps.length / ITEMS_PER_PAGE));
    const startIdx = page * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    const pageApps = apps.slice(startIdx, endIdx);

    // Fixed column widths
    const COL_ID = 8;
    const COL_COMPANY = 32;
    const COL_PLATFORM = 24;
    const COL_STATUS = 16;

    function capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Platform color mapping
    const platformColors: Record<string, string> = {
        linkedin: 'blue',
        indeed: 'magenta',
        company_website: 'green',
        other: 'yellow'
    };

    // Status color mapping (background and text)
    const statusColors: Record<string, { bg: string; fg: string }> = {
        pending: { bg: 'yellow', fg: 'black' },
        interview: { bg: 'blue', fg: 'white' },
        offer: { bg: 'green', fg: 'white' },
        accepted: { bg: 'green', fg: 'white' },
        rejected: { bg: 'red', fg: 'white' },
        // fallback
        delete: { bg: 'red', fg: 'white' }
    };

    return (
        <>
            <Text>Job Applications List:</Text>
            <Box flexDirection="row">
                <Box width={COL_ID}><Text bold>ID</Text></Box>
                <Box width={COL_COMPANY}><Text bold>Company Name</Text></Box>
                <Box width={COL_PLATFORM}><Text bold>Platform</Text></Box>
                <Box width={COL_STATUS}><Text bold>Status</Text></Box>
            </Box>
            <Box flexDirection="row">
                <Box width={COL_ID}><Text>{'-'.repeat(COL_ID)}</Text></Box>
                <Box width={COL_COMPANY}><Text>{'-'.repeat(COL_COMPANY)}</Text></Box>
                <Box width={COL_PLATFORM}><Text>{'-'.repeat(COL_PLATFORM)}</Text></Box>
                <Box width={COL_STATUS}><Text>{'-'.repeat(COL_STATUS)}</Text></Box>
            </Box>
            {pageApps.map((app, idx) => {
                const platformColor = platformColors[app.platform] || 'white';
                const statusColor = statusColors[app.status] || { bg: 'white', fg: 'black' };
                return (
                    <React.Fragment key={app.id}>
                        <Box flexDirection="row">
                            <Box width={COL_ID}><Text>{String(app.id)}</Text></Box>
                            <Box width={COL_COMPANY}><Text>{app.companyName}</Text></Box>
                            <Box width={COL_PLATFORM}><Text color={platformColor}>{capitalize(app.platform)}</Text></Box>
                            <Box width={COL_STATUS}><Text color={statusColor.fg} backgroundColor={statusColor.bg}>{capitalize(app.status)}</Text></Box>
                        </Box>
                        {idx < pageApps.length - 1 && (
                            <Box>
                                <Text color="gray">{'─'.repeat(COL_ID + COL_COMPANY + COL_PLATFORM + COL_STATUS)}</Text>
                            </Box>
                        )}
                    </React.Fragment>
                );
            })}
            <Text color="cyan">Press [ESC] to return. Use ←/→ for pages ({page + 1}/{totalPages}).</Text>
        </>
    );
};
