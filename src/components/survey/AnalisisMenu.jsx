import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box } from '@mui/material';
import { ChartMenu } from './ChartMenu';
import { MultiMenu } from '../charts/multi/MultiMenu';
import { SummaryMenu } from '../charts/summary/SummaryMenu';

function TabPanel({ children, value, index }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`tab-panel-${index}`}>
            {value === index && <Box p={2}>{children}</Box>}
        </div>
    );
}

export const AnalisisMenu = () => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <Box>
            <AppBar position="static" color="default">
                <Tabs
                    value={tabIndex}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab label="Survey Summary" />
                    <Tab label="Simple Analysis" />
                    <Tab label="Multi-Survey Analysis" />
                </Tabs>
            </AppBar>
            <TabPanel value={tabIndex} index={0}><SummaryMenu /></TabPanel>
            <TabPanel value={tabIndex} index={1}><ChartMenu /></TabPanel>
            <TabPanel value={tabIndex} index={2}><MultiMenu /></TabPanel>
        </Box>
    );
};

