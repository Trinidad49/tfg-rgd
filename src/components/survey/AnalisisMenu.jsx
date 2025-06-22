import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box } from '@mui/material';
import { ChartMenu } from './ChartMenu';
import { MultiMenu } from '../charts/multi/MultiMenu';

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
                    <Tab label="Simple Analysis" />
                    <Tab label="Multi-Survey Analysis" />
                    <Tab label="Filtered Analysis" />
                    <Tab label="WIP" />
                </Tabs>
            </AppBar>

            <TabPanel value={tabIndex} index={0}><ChartMenu /></TabPanel>
            <TabPanel value={tabIndex} index={1}><MultiMenu /></TabPanel>
            <TabPanel value={tabIndex} index={2}><ChartMenu /></TabPanel>
            <TabPanel value={tabIndex} index={3}><ChartMenu /></TabPanel>
        </Box>
    );
};

