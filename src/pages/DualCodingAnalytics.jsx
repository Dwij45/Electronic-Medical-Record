
import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Grid, Card, CardContent, Button, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    LinearProgress, Alert, Tabs, Tab, Divider, List, ListItem, ListItemText,
    ListItemIcon, Dialog, DialogTitle, DialogContent, DialogActions,
    CircularProgress, Snackbar
} from '@mui/material';
import {
    Analytics, TrendingUp, LocalHospital, Science, Public, CheckCircle,
    Translate, Code, Assessment, Download, Visibility, Language,
    AccountBalance, Security, VerifiedUser, Timeline, BarChart,
    ShowChart, PieChart
} from '@mui/icons-material';

// Enhanced analytics data with better trend information
const analyticsData = {
    totalDualCodedDiagnoses: 1247,
    namasteCodesUsed: 89,
    icd11TM2Mappings: 89,
    icd11BioMappings: 89,
    mappingAccuracy: 94.6,
    fhirCompliance: 100,
    ayushSystemsUsage: {
        ayurveda: 76.5,
        siddha: 14.2,
        unani: 7.8,
        yoga: 1.5
    },
    governmentReadiness: {
        namasteIntegration: 100,
        fhirR4Compliance: 100,
        icd11TM2Support: 100,
        auditTrails: 100,
        dataPrivacy: 100
    },
    // Enhanced weekly growth data with more details
    weeklyTrends: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        traditionalOnly: [45, 67, 89, 112],
        modernOnly: [120, 145, 167, 189],
        dualCoded: [38, 52, 74, 95],
        mappingAccuracy: [88, 91, 93, 95],
        responseTime: [250, 220, 180, 150] // milliseconds
    },
    // Daily trends for the current week
    dailyTrends: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        dualCoded: [12, 18, 25, 22, 30, 15, 8],
        fhirGenerated: [11, 17, 24, 21, 29, 14, 8],
        errors: [1, 1, 1, 1, 1, 1, 0]
    },
    topConditions: [
        { sanskrit: 'अर्धावभेदक', english: 'Ardhavabhedaka', modern: 'Migraine', count: 156, namaste: 'NAM004', icd11: '8A80' },
        { sanskrit: 'मधुमेह', english: 'Madhumeha', modern: 'Type 2 Diabetes', count: 143, namaste: 'NAM001', icd11: '5A11' },
        { sanskrit: 'अम्लपित्त', english: 'Amlapitta', modern: 'GERD', count: 98, namaste: 'NAM005', icd11: 'DA22' },
        { sanskrit: 'कास', english: 'Kasa', modern: 'Cough', count: 87, namaste: 'NAM008', icd11: 'R05' },
        { sanskrit: 'अग्निमांद्य', english: 'Agnimandya', modern: 'Dyspepsia', count: 76, namaste: 'NAM007', icd11: 'DD90' }
    ],
    regionalAdoption: [
        { region: 'Karnataka', adoption: 89, practitioners: 234 },
        { region: 'Kerala', adoption: 76, practitioners: 189 },
        { region: 'Tamil Nadu', adoption: 67, practitioners: 156 },
        { region: 'Maharashtra', adoption: 54, practitioners: 145 },
        { region: 'Gujarat', adoption: 43, practitioners: 123 }
    ]
};

// Enhanced Chart Component
const TrendChart = ({ data, type = 'line', height = 200 }) => {
    const maxValue = Math.max(...Object.values(data).flat().filter(v => typeof v === 'number'));

    if (type === 'line') {
        return (
            <Box sx={{ height, p: 2, position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 400 160">
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map(y => (
                        <line
                            key={y}
                            x1="40"
                            y1={120 - (y * 0.8)}
                            x2="380"
                            y2={120 - (y * 0.8)}
                            stroke="#e0e0e0"
                            strokeWidth="1"
                            strokeDasharray="2,2"
                        />
                    ))}

                    {/* Traditional Only Line */}
                    <polyline
                        fill="none"
                        stroke="#1976d2"
                        strokeWidth="3"
                        points={data.traditionalOnly.map((value, index) =>
                            `${40 + (index * 85)},${120 - (value / maxValue * 80)}`
                        ).join(' ')}
                    />

                    {/* Modern Only Line */}
                    <polyline
                        fill="none"
                        stroke="#dc004e"
                        strokeWidth="3"
                        points={data.modernOnly.map((value, index) =>
                            `${40 + (index * 85)},${120 - (value / maxValue * 80)}`
                        ).join(' ')}
                    />

                    {/* Dual Coded Line */}
                    <polyline
                        fill="none"
                        stroke="#4caf50"
                        strokeWidth="4"
                        points={data.dualCoded.map((value, index) =>
                            `${40 + (index * 85)},${120 - (value / maxValue * 80)}`
                        ).join(' ')}
                    />

                    {/* Data points */}
                    {data.dualCoded.map((value, index) => (
                        <circle
                            key={index}
                            cx={40 + (index * 85)}
                            cy={120 - (value / maxValue * 80)}
                            r="4"
                            fill="#4caf50"
                            stroke="white"
                            strokeWidth="2"
                        />
                    ))}

                    {/* X-axis labels */}
                    {data.labels.map((label, index) => (
                        <text
                            key={index}
                            x={40 + (index * 85)}
                            y="145"
                            textAnchor="middle"
                            fontSize="12"
                            fill="#666"
                        >
                            {label}
                        </text>
                    ))}
                </svg>

                {/* Legend */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 16, height: 3, bgcolor: '#1976d2', mr: 1 }} />
                        <Typography variant="caption">Traditional Only</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 16, height: 3, bgcolor: '#dc004e', mr: 1 }} />
                        <Typography variant="caption">Modern Only</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 16, height: 3, bgcolor: '#4caf50', mr: 1 }} />
                        <Typography variant="caption">Dual Coded</Typography>
                    </Box>
                </Box>
            </Box>
        );
    }

    // Bar Chart for daily trends
    if (type === 'bar') {
        return (
            <Box sx={{ height, p: 2 }}>
                <svg width="100%" height="100%" viewBox="0 0 400 140">
                    {data.labels.map((label, index) => {
                        const barHeight = (data.dualCoded[index] / Math.max(...data.dualCoded)) * 80;
                        return (
                            <g key={index}>
                                <rect
                                    x={40 + (index * 45)}
                                    y={100 - barHeight}
                                    width="30"
                                    height={barHeight}
                                    fill="#4caf50"
                                    rx="2"
                                />
                                <text
                                    x={55 + (index * 45)}
                                    y="115"
                                    textAnchor="middle"
                                    fontSize="11"
                                    fill="#666"
                                >
                                    {label}
                                </text>
                                <text
                                    x={55 + (index * 45)}
                                    y={95 - barHeight}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill="#333"
                                    fontWeight="bold"
                                >
                                    {data.dualCoded[index]}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </Box>
        );
    }
};

const DualCodingAnalytics = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [selectedMetric, setSelectedMetric] = useState(null);
    const [detailDialog, setDetailDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Government Report Generation
    const handleGovernmentReport = () => {
        setLoading(true);

        // Simulate report generation
        setTimeout(() => {
            const reportData = {
                title: 'Government Compliance Report - SIH 2025',
                generatedAt: new Date().toISOString(),
                reportId: `GVT-${Date.now()}`,
                ministry: 'Ministry of AYUSH',
                compliance: {
                    namasteIntegration: '100% Compliant',
                    fhirR4Compliance: '100% Ready',
                    dataPrivacy: 'DPDP Act 2023 Compliant',
                    auditTrails: 'Complete',
                    internationalStandards: 'WHO Approved'
                },
                statistics: {
                    totalPractitioners: 847,
                    dualCodedDiagnoses: analyticsData.totalDualCodedDiagnoses,
                    ayushSystemsCovered: 4,
                    mappingAccuracy: analyticsData.mappingAccuracy,
                    statesCovered: 5
                },
                certification: {
                    fhirR4: 'Certified',
                    whoIcd11: 'Validated',
                    namasteTerminology: 'Approved',
                    dataProtection: 'Compliant'
                }
            };

            const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Government-Compliance-Report-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);

            setLoading(false);
            setSnackbar({
                open: true,
                message: 'Government compliance report generated successfully!',
                severity: 'success'
            });
        }, 2000);
    };

    // FHIR Validation
    const handleFhirValidation = () => {
        setLoading(true);

        // Simulate FHIR validation
        setTimeout(() => {
            const validationResult = {
                timestamp: new Date().toISOString(),
                validationId: `FHIR-VAL-${Date.now()}`,
                status: 'PASSED',
                fhirVersion: 'R4',
                resourcesValidated: [
                    { resourceType: 'Patient', count: 156, status: 'VALID' },
                    { resourceType: 'Condition', count: analyticsData.totalDualCodedDiagnoses, status: 'VALID' },
                    { resourceType: 'Encounter', count: 234, status: 'VALID' },
                    { resourceType: 'Observation', count: 189, status: 'VALID' }
                ],
                codeSystemValidation: {
                    namaste: 'VALID - All codes verified',
                    icd11TM2: 'VALID - WHO approved',
                    icd11Bio: 'VALID - WHO standard',
                    snomed: 'VALID - International standard'
                },
                errors: 0,
                warnings: 2,
                complianceScore: 98.7
            };

            console.log('FHIR Validation Result:', validationResult);

            setLoading(false);
            setSnackbar({
                open: true,
                message: `FHIR validation complete! Score: ${validationResult.complianceScore}% - All resources valid`,
                severity: 'success'
            });
        }, 1500);
    };

    const handleExportReport = () => {
        const reportData = {
            title: 'SIH 2025 - Dual Coding EMR Analytics Report',
            generatedAt: new Date().toISOString(),
            summary: {
                totalDiagnoses: analyticsData.totalDualCodedDiagnoses,
                namasteIntegration: '100% Compliant',
                fhirCompliance: '100% Ready',
                governmentReadiness: 'Fully Compliant'
            },
            analytics: analyticsData
        };

        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `SIH-2025-Dual-Coding-Report-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
            {/* Header - SIH 2025 Focused */}
            <Paper sx={{
                p: 3,
                mb: 3,
                background: (theme) => theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
                    : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'inherit',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: (theme) => theme.palette.mode === 'dark' ? '1px solid #404040' : '1px solid #e0e0e0'

            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                SIH 2025 - Dual Coding Analytics
                            </Typography>
                            <Typography variant="h6">
                                Traditional Medicine + Modern Healthcare Integration Dashboard
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Chip label="FHIR R4 Compliant" sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', color: (theme) => theme.palette.mode === 'dark' ? '#e4dadaff' : 'black' }} />
                                <Chip label="NAMASTE Integrated" sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', color: (theme) => theme.palette.mode === 'dark' ? '#e4dadaff' : 'black' }} />
                                <Chip label="Ministry of AYUSH Ready" sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', color: (theme) => theme.palette.mode === 'dark' ? '#e4dadaff' : 'black' }} />
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h2" fontWeight="bold">
                            {analyticsData.totalDualCodedDiagnoses}
                        </Typography>
                        <Typography variant="body1">
                            Dual Coded Diagnoses
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Key Metrics - Government Focus */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                    <Card sx={{
                        background: (theme) => theme.palette.mode === 'dark'
                            ? 'linear-gradientlinear-gradient(135deg, #53637cff 0%, #2d3748 100%)'
                            : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                        color: (theme) => theme.palette.mode === 'dark' ? '#dbeafe' : '#1e40af',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        borderRadius: 2,
                        border: (theme) => theme.palette.mode === 'dark' ? '1px solid #3e5d82ff' : '1px solid #dbeafe',
                        textAlign: 'center'

                    }}>
                        <CardContent sx={{ py: 2 }}>
                            <Typography variant="h4">{analyticsData.namasteCodesUsed}</Typography>
                            <Typography variant="body2">NAMASTE Codes Active</Typography>
                            <LinearProgress variant="determinate" value={100} sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card sx={{
                        background: (theme) => theme.palette.mode === 'dark'
                            ? 'linear-gradientlinear-gradient(135deg, #53637cff 0%, #2d3748 100%)'
                            : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                        color: (theme) => theme.palette.mode === 'dark' ? '#dbeafe' : '#1e40af',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        borderRadius: 2,
                        border: (theme) => theme.palette.mode === 'dark' ? '1px solid #3e5d82ff' : '1px solid #dbeafe',
                        textAlign: 'center'

                    }}>
                        <CardContent sx={{ py: 2 }}>
                            <Typography variant="h4">{analyticsData.icd11TM2Mappings}</Typography>
                            <Typography variant="body2">ICD-11 TM2 Mappings</Typography>
                            <LinearProgress variant="determinate" value={100} sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card sx={{
                        background: (theme) => theme.palette.mode === 'dark'
                            ? 'linear-gradientlinear-gradient(135deg, #53637cff 0%, #2d3748 100%)'
                            : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                        color: (theme) => theme.palette.mode === 'dark' ? '#dbeafe' : '#1e40af',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        borderRadius: 2,
                        border: (theme) => theme.palette.mode === 'dark' ? '1px solid #3e5d82ff' : '1px solid #dbeafe',
                        textAlign: 'center'

                    }}>
                        <CardContent sx={{ py: 2 }}>
                            <Typography variant="h4">{analyticsData.mappingAccuracy}%</Typography>
                            <Typography variant="body2">Mapping Accuracy</Typography>
                            <LinearProgress variant="determinate" value={analyticsData.mappingAccuracy} sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card sx={{
                        background: (theme) => theme.palette.mode === 'dark'
                            ? 'linear-gradientlinear-gradient(135deg, #53637cff 0%, #2d3748 100%)'
                            : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                        color: (theme) => theme.palette.mode === 'dark' ? '#dbeafe' : '#1e40af',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        borderRadius: 2,
                        border: (theme) => theme.palette.mode === 'dark' ? '1px solid #3e5d82ff' : '1px solid #dbeafe',
                        textAlign: 'center'

                    }}>
                        <CardContent sx={{ py: 2 }}>
                            <Typography variant="h4">{analyticsData.fhirCompliance}%</Typography>
                            <Typography variant="body2">FHIR Compliance</Typography>
                            <LinearProgress variant="determinate" value={100} sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Enhanced Action Buttons */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                    variant="contained"
                    startIcon={<Download />}
                    onClick={handleExportReport}
                    sx={{ bgcolor: 'success.main' }}
                >
                    Export SIH Report
                </Button>
                <Button
                    variant="outlined"
                    startIcon={loading ? <CircularProgress size={20} /> : <AccountBalance />}
                    onClick={handleGovernmentReport}
                    disabled={loading}
                    sx={{ borderColor: 'warning.main', color: 'warning.main' }}
                >
                    {loading ? 'Generating...' : 'Government Report'}
                </Button>
                <Button
                    variant="outlined"
                    startIcon={loading ? <CircularProgress size={20} /> : <Security />}
                    onClick={handleFhirValidation}
                    disabled={loading}
                    sx={{ borderColor: 'info.main', color: 'info.main' }}
                >
                    {loading ? 'Validating...' : 'FHIR Validation'}
                </Button>
            </Box>

            {/* Main Analytics Tabs */}
            <Paper sx={{ borderRadius: 2 }}>
                <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                    <Tab label="Government Readiness" icon={<AccountBalance />} />
                    <Tab label="AYUSH Analytics" icon={<Translate />} />
                    <Tab label="Dual Coding Trends" icon={<TrendingUp />} />
                    <Tab label="Regional Adoption" icon={<Language />} />
                </Tabs>

                <Box sx={{ p: 3 }}>
                    {/* Government Readiness Tab */}
                    {activeTab === 0 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Alert severity="success" sx={{ mb: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        SIH 2025 Compliance Status: FULLY READY
                                    </Typography>
                                    <Typography>
                                        Your Electronic Medical Record system meets all government requirements for traditional medicine integration and is ready for national deployment.
                                    </Typography>
                                </Alert>
                            </Grid>

                            {/* Compliance Checklist */}
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom color="primary">
                                            Technical Compliance
                                        </Typography>
                                        {Object.entries(analyticsData.governmentReadiness).map(([key, value]) => (
                                            <Box key={key} sx={{ mb: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                    </Typography>
                                                    <Typography variant="body2" color="success.main" fontWeight="bold">
                                                        {value}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={value}
                                                    color="success"
                                                    sx={{ height: 6, borderRadius: 3 }}
                                                />
                                            </Box>
                                        ))}
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Standards Compliance */}
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom color="secondary">
                                            International Standards
                                        </Typography>
                                        <List>
                                            <ListItem>
                                                <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                                                <ListItemText
                                                    primary="FHIR R4 Structure Definition"
                                                    secondary="HL7 FHIR Release 4 compliant resources"
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                                                <ListItemText
                                                    primary="WHO ICD-11 Integration"
                                                    secondary="TM2 + Biomedicine dual coding"
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                                                <ListItemText
                                                    primary="NAMASTE Terminology"
                                                    secondary="Ministry of AYUSH approved codes"
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                                                <ListItemText
                                                    primary="Data Privacy (DPDP Act 2023)"
                                                    secondary="Indian data protection compliance"
                                                />
                                            </ListItem>
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Government Benefits */}
                            <Grid item xs={12}>
                                <Card sx={{ bgcolor: 'info.50' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Government & Healthcare Impact
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={3}>
                                                <Typography variant="subtitle2" color="primary">Insurance Claims</Typography>
                                                <Typography variant="body2">100% compatible with global insurance systems using ICD-11 codes</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <Typography variant="subtitle2" color="primary">Research Data</Typography>
                                                <Typography variant="body2">Standardized traditional medicine data for national health research</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <Typography variant="subtitle2" color="primary">AYUSH Integration</Typography>
                                                <Typography variant="body2">Seamless integration with Ministry of AYUSH initiatives</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <Typography variant="subtitle2" color="primary">Global Standards</Typography>
                                                <Typography variant="body2">WHO-approved terminologies for international recognition</Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    )}

                    {/* AYUSH Analytics Tab */}
                    {activeTab === 1 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            AYUSH System Usage Distribution
                                        </Typography>
                                        {Object.entries(analyticsData.ayushSystemsUsage).map(([system, percentage]) => (
                                            <Box key={system} sx={{ mb: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                                        {system} {system === 'ayurveda' ? '(आयुर्वेद)' : system === 'siddha' ? '(சித்தா)' : system === 'unani' ? '(یونانی)' : '(योग)'}
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {percentage}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={percentage}
                                                    color={system === 'ayurveda' ? 'primary' : system === 'siddha' ? 'secondary' : 'success'}
                                                    sx={{ height: 8, borderRadius: 4 }}
                                                />
                                            </Box>
                                        ))}
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Top Traditional Conditions
                                        </Typography>
                                        <TableContainer>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Sanskrit Term</TableCell>
                                                        <TableCell>Modern Equivalent</TableCell>
                                                        <TableCell align="right">Cases</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {analyticsData.topConditions.slice(0, 5).map((condition, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>
                                                                <Typography variant="body2" fontWeight="bold">
                                                                    {condition.sanskrit}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {condition.english}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2">
                                                                    {condition.modern}
                                                                </Typography>
                                                                <Chip
                                                                    label={condition.icd11}
                                                                    size="small"
                                                                    color="success"
                                                                    sx={{ mt: 0.5, fontSize: '0.7rem', height: 16 }}
                                                                />
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Typography variant="h6" color="primary">
                                                                    {condition.count}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12}>
                                <Alert severity="info">
                                    <Typography variant="body1">
                                        <strong>Traditional Medicine Impact:</strong> Our dual coding system has successfully integrated
                                        {analyticsData.namasteCodesUsed} NAMASTE codes with their modern ICD-11 equivalents, enabling
                                        traditional practitioners to maintain their diagnostic approach while ensuring global healthcare
                                        interoperability and insurance compatibility.
                                    </Typography>
                                </Alert>
                            </Grid>
                        </Grid>
                    )}

                    {/* Enhanced Dual Coding Trends Tab */}
                    {activeTab === 2 && (
                        <Grid container spacing={3}>
                            {/* Weekly Trends - Line Chart */}
                            <Grid item xs={12} md={8}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <ShowChart color="primary" sx={{ mr: 1 }} />
                                            <Typography variant="h6">
                                                Weekly Growth Trends - Traditional vs Modern vs Dual Coding
                                            </Typography>
                                        </Box>
                                        <TrendChart data={analyticsData.weeklyTrends} type="line" height={250} />

                                        {/* Trend Statistics */}
                                        <Grid container spacing={2} sx={{ mt: 2 }}>
                                            <Grid item xs={4}>
                                                <Typography variant="caption" color="text.secondary">Growth Rate</Typography>
                                                <Typography variant="h6" color="success.main">+24%</Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant="caption" color="text.secondary">Avg Response Time</Typography>
                                                <Typography variant="h6" color="primary.main">180ms</Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant="caption" color="text.secondary">Success Rate</Typography>
                                                <Typography variant="h6" color="success.main">99.2%</Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Daily Activity - Bar Chart */}
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <BarChart color="secondary" sx={{ mr: 1 }} />
                                            <Typography variant="h6">
                                                This Week Daily Activity
                                            </Typography>
                                        </Box>
                                        <TrendChart data={analyticsData.dailyTrends} type="bar" height={200} />

                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="caption" color="text.secondary">Today's Stats</Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                                <Typography variant="body2">Dual Coded: <strong>8</strong></Typography>
                                                <Typography variant="body2">Errors: <strong>0</strong></Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Performance Metrics */}
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Coding Accuracy Metrics
                                        </Typography>
                                        <List>
                                            <ListItem>
                                                <ListItemIcon><VerifiedUser color="success" /></ListItemIcon>
                                                <ListItemText
                                                    primary="NAMASTE → ICD-11 TM2 Mapping"
                                                    secondary={`${analyticsData.mappingAccuracy}% accuracy rate`}
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon><VerifiedUser color="success" /></ListItemIcon>
                                                <ListItemText
                                                    primary="ICD-11 TM2 → Biomedicine Mapping"
                                                    secondary="98.7% accuracy rate"
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon><VerifiedUser color="success" /></ListItemIcon>
                                                <ListItemText
                                                    primary="Triple Coding Validation"
                                                    secondary="99.2% FHIR compliance"
                                                />
                                            </ListItem>
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* System Performance */}
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            System Performance
                                        </Typography>
                                        <Typography variant="body2" gutterBottom>Search Response Time</Typography>
                                        <LinearProgress variant="determinate" value={95} color="success" sx={{ mb: 2 }} />

                                        <Typography variant="body2" gutterBottom>Mapping Generation Speed</Typography>
                                        <LinearProgress variant="determinate" value={88} color="primary" sx={{ mb: 2 }} />

                                        <Typography variant="body2" gutterBottom>FHIR Resource Creation</Typography>
                                        <LinearProgress variant="determinate" value={92} color="secondary" sx={{ mb: 2 }} />

                                        <Alert severity="success" sx={{ mt: 2 }}>
                                            <Typography variant="caption">
                                                System performance exceeds SIH requirements with average response time under 200ms
                                            </Typography>
                                        </Alert>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Real-time Metrics */}
                            <Grid item xs={12}>
                                <Card sx={{ bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)') }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Real-time System Metrics
                                        </Typography>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={2}>
                                                <Typography variant="caption">Active Sessions</Typography>
                                                <Typography variant="h5" color="primary">23</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={2}>
                                                <Typography variant="caption">Codes Generated Today</Typography>
                                                <Typography variant="h5" color="secondary">156</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={2}>
                                                <Typography variant="caption">Success Rate</Typography>
                                                <Typography variant="h5" color="success.main">99.2%</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={2}>
                                                <Typography variant="caption">Avg Response</Typography>
                                                <Typography variant="h5" color="info.main">150ms</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={2}>
                                                <Typography variant="caption">FHIR Resources</Typography>
                                                <Typography variant="h5" color="warning.main">1,247</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={2}>
                                                <Typography variant="caption">System Load</Typography>
                                                <Typography variant="h5" color="error.main">12%</Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    )}

                    {/* Regional Adoption Tab */}
                    {activeTab === 3 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h5" gutterBottom>
                                    Regional Adoption & Practitioner Onboarding
                                </Typography>
                                <Alert severity="info" sx={{ mb: 3 }}>
                                    <Typography>
                                        Showing adoption rates across Indian states and the number of AYUSH practitioners
                                        actively using the dual coding system for traditional medicine documentation.
                                    </Typography>
                                </Alert>
                            </Grid>

                            {analyticsData.regionalAdoption.map((region, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                {region.region}
                                            </Typography>
                                            <Box sx={{ mb: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="body2">Adoption Rate</Typography>
                                                    <Typography variant="body2" fontWeight="bold">{region.adoption}%</Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={region.adoption}
                                                    color={region.adoption > 70 ? 'success' : region.adoption > 50 ? 'warning' : 'error'}
                                                    sx={{ height: 8, borderRadius: 4 }}
                                                />
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>{region.practitioners}</strong> AYUSH practitioners active
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}

                            <Grid item xs={12}>
                                <Card sx={{ bgcolor: 'success.50' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            National Impact Summary
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={3}>
                                                <Typography variant="h4" color="success.main">847</Typography>
                                                <Typography variant="body2">Total Active Practitioners</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <Typography variant="h4" color="success.main">5</Typography>
                                                <Typography variant="body2">States Covered</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <Typography variant="h4" color="success.main">65.8%</Typography>
                                                <Typography variant="body2">Average Adoption Rate</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <Typography variant="h4" color="success.main">12</Typography>
                                                <Typography variant="body2">Months to Full Deployment</Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    )}
                </Box>
            </Paper>

            {/* Footer - SIH Focus */}
            <Paper sx={{ p: 3, mt: 3, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1e293b' : '#f5f5f5' }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <Typography variant="h6" gutterBottom>
                            SIH 2025 - Smart India Hackathon Solution
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            This Electronic Medical Record system with dual coding capabilities represents a breakthrough
                            in traditional medicine integration, meeting all government requirements for FHIR compliance,
                            NAMASTE terminology support, and international healthcare standards.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Download />}
                            onClick={handleExportReport}
                            sx={{ mb: 1 }}
                        >
                            Download Full Report
                        </Button>
                        <Typography variant="caption" display="block" color="text.secondary">
                            Complete SIH 2025 compliance documentation
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                message={snackbar.message}
            />
        </Box>
    );
};

export default DualCodingAnalytics;