import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Grid, Card, CardContent, TextField, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, Alert, Tabs, Tab, InputAdornment, Autocomplete, Divider,
    IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    List, ListItem, ListItemText, ListItemIcon, Badge
} from '@mui/material';
import {
    Search, Code, Translate, Visibility, FilterList, Download,
    LocalHospital, Science, Public, ArrowForward, Verified
} from '@mui/icons-material';

// Medical coding mapping data
const codingMappings = [
    {
        id: 'MAP001',
        namaste: {
            code: 'NAM004',
            term: 'अर्धावभेदक',
            english: 'Ardhavabhedaka',
            system: 'ayurveda',
            definition: 'Half-sided head pain according to Ayurvedic classification'
        },
        icd11TM2: {
            code: 'TM2.A01.2',
            term: 'Traditional migraine pattern',
            definition: 'Traditional medicine perspective on migraine-type headaches'
        },
        icd11Bio: {
            code: '8A80',
            term: 'Migraine',
            definition: 'Recurrent headache disorder characterized by moderate to severe headaches'
        },
        confidence: 0.95,
        whoTerminology: 'WHO-AY-NEU-001',
        searchTerms: ['शिरोरोग', 'shirog', 'headache', 'migraine', 'ardhavabhedaka']
    },
    {
        id: 'MAP002',
        namaste: {
            code: 'NAM001',
            term: 'मधुमेह',
            english: 'Madhumeha',
            system: 'ayurveda',
            definition: 'Sweet urine disease - traditional term for diabetes'
        },
        icd11TM2: {
            code: 'TM2.E01.1',
            term: 'Traditional diabetes pattern',
            definition: 'Traditional medicine approach to diabetes-like conditions'
        },
        icd11Bio: {
            code: '5A11',
            term: 'Type 2 Diabetes Mellitus',
            definition: 'Metabolic disorder characterized by high blood glucose levels'
        },
        confidence: 0.98,
        whoTerminology: 'WHO-AY-END-001',
        searchTerms: ['मधुमेह', 'madhumeha', 'diabetes', 'sugar', 'prameha']
    },
    {
        id: 'MAP003',
        namaste: {
            code: 'NAM005',
            term: 'अम्लपित्त',
            english: 'Amlapitta',
            system: 'ayurveda',
            definition: 'Acid-pitta disorder affecting digestive system'
        },
        icd11TM2: {
            code: 'TM2.G01.1',
            term: 'Traditional acid-pitta disorder',
            definition: 'Traditional medicine understanding of acid-related digestive disorders'
        },
        icd11Bio: {
            code: 'DA22',
            term: 'Gastroesophageal Reflux Disease',
            definition: 'Chronic condition where stomach acid flows back into esophagus'
        },
        confidence: 0.92,
        whoTerminology: 'WHO-AY-GAS-002',
        searchTerms: ['अम्लपित्त', 'amlapitta', 'acidity', 'gerd', 'heartburn']
    },
    {
        id: 'MAP004',
        namaste: {
            code: 'NAM008',
            term: 'कास',
            english: 'Kasa',
            system: 'ayurveda',
            definition: 'Cough according to traditional Ayurvedic classification'
        },
        icd11TM2: {
            code: 'TM2.R01.2',
            term: 'Traditional cough pattern',
            definition: 'Traditional medicine classification of cough patterns'
        },
        icd11Bio: {
            code: 'R05',
            term: 'Cough',
            definition: 'Sudden, forceful hacking sound to release air and clear irritation'
        },
        confidence: 0.94,
        whoTerminology: 'WHO-AY-RES-001',
        searchTerms: ['कास', 'kasa', 'cough', 'khansi', 'bronchitis']
    },
    {
        id: 'MAP005',
        namaste: {
            code: 'NAM007',
            term: 'अग्निमांद्य',
            english: 'Agnimandya',
            system: 'ayurveda',
            definition: 'Weak digestive fire - fundamental concept in Ayurveda'
        },
        icd11TM2: {
            code: 'TM2.G01.3',
            term: 'Traditional digestive fire weakness',
            definition: 'Traditional medicine concept of weak digestive fire'
        },
        icd11Bio: {
            code: 'DD90',
            term: 'Functional Dyspepsia',
            definition: 'Chronic or recurring pain in upper abdomen'
        },
        confidence: 0.88,
        whoTerminology: 'WHO-AY-GAS-001',
        searchTerms: ['अग्निमांद्य', 'agnimandya', 'indigestion', 'dyspepsia', 'weak digestion']
    }
];

const MedicalCodingMapping = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMappings, setFilteredMappings] = useState(codingMappings);
    const [selectedMapping, setSelectedMapping] = useState(null);
    const [detailsDialog, setDetailsDialog] = useState(false);
    const [systemFilter, setSystemFilter] = useState('all');

    // Search and filter logic
    useEffect(() => {
        let filtered = codingMappings;

        // Search filter
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(mapping =>
                mapping.searchTerms.some(term => term.toLowerCase().includes(searchLower)) ||
                mapping.namaste.term.includes(searchTerm) ||
                mapping.namaste.english.toLowerCase().includes(searchLower) ||
                mapping.icd11Bio.term.toLowerCase().includes(searchLower)
            );
        }

        // System filter
        if (systemFilter !== 'all') {
            filtered = filtered.filter(mapping => mapping.namaste.system === systemFilter);
        }

        setFilteredMappings(filtered);
    }, [searchTerm, systemFilter]);

    const getConfidenceColor = (confidence) => {
        if (confidence >= 0.9) return 'success';
        if (confidence >= 0.7) return 'warning';
        return 'error';
    };

    const getConfidenceLabel = (confidence) => {
        if (confidence >= 0.9) return 'High Confidence';
        if (confidence >= 0.7) return 'Medium Confidence';
        return 'Low Confidence';
    };

    const exportMappings = () => {
        const csvContent = [
            ['NAMASTE Code', 'Sanskrit Term', 'English Term', 'ICD-11 TM2', 'ICD-11 Bio', 'Confidence'],
            ...filteredMappings.map(mapping => [
                mapping.namaste.code,
                mapping.namaste.term,
                mapping.namaste.english,
                mapping.icd11TM2.code,
                mapping.icd11Bio.code,
                (mapping.confidence * 100).toFixed(1) + '%'
            ])
        ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `medical-coding-mappings-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
            {/* Header */}
            <Paper sx={{
                p: 2,
                mb: 2,
                background: (theme) => theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
                    : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'inherit',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: (theme) => theme.palette.mode === 'dark' ? '1px solid #404040' : '1px solid #e0e0e0'
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Code sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                Medical Coding Mapping
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                NAMASTE ↔ ICD-11 TM2 ↔ ICD-11 Biomedicine Integration
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="bold">
                            {filteredMappings.length}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Active Mappings
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Statistics Cards */}
            <Grid container spacing={2} sx={{ mb: 3, justifyContent: 'center' }}>
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
                        <CardContent>
                            <LocalHospital sx={{ fontSize: 25, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                                {codingMappings.length}
                            </Typography>
                            <Typography variant="body1">NAMASTE Terms</Typography>
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
                        <CardContent>
                            <Science sx={{ fontSize: 25, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                                {codingMappings.length}
                            </Typography>
                            <Typography variant="body1">ICD-11 TM2</Typography>
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
                        <CardContent>
                            <Public sx={{ fontSize: 25, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                                {codingMappings.length}
                            </Typography>
                            <Typography variant="body1" >ICD-11 Bio</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card sx={{
                        background: (theme) => theme.palette.mode === 'dark'
                            ? 'linear-gradientlinear-gradient(135deg, #53637cff 0%, #394760ff 100%)'
                            : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                        color: (theme) => theme.palette.mode === 'dark' ? '#dbeafe' : '#1e40af',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        borderRadius: 2,
                        border: (theme) => theme.palette.mode === 'dark' ? '1px solid #3e5d82ff' : '1px solid #dbeafe',
                        textAlign: 'center'
                    }}>
                        <CardContent>
                            <Verified sx={{ fontSize: 25, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                                {Math.round((codingMappings.reduce((sum, m) => sum + m.confidence, 0) / codingMappings.length) * 100)}%
                            </Typography>
                            <Typography variant="body1">Avg Confidence</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Search and Filters */}
            <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Search Medical Terms"
                            placeholder="Search: शिरोरोग, shirog, headache, NAM004, 8A80..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Autocomplete
                            options={['all', 'ayurveda', 'siddha', 'unani']}
                            value={systemFilter}
                            onChange={(e, value) => setSystemFilter(value || 'all')}
                            getOptionLabel={(option) => option === 'all' ? 'All Systems' : option.charAt(0).toUpperCase() + option.slice(1)}
                            renderInput={(params) => (
                                <TextField {...params} label="Filter by System" />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setSearchTerm('');
                                    setSystemFilter('all');
                                }}
                                startIcon={<FilterList />}
                            >
                                Clear
                            </Button>
                            <Button
                                variant="contained"
                                onClick={exportMappings}
                                startIcon={<Download />}
                            >
                                Export
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Main Content */}
            <Paper sx={{ borderRadius: 2 }}>
                <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                    <Tab label="Mapping Table" icon={<Code />} />
                    <Tab label="Visual Mapping" icon={<Translate />} />
                    <Tab label="Search Examples" icon={<Search />} />
                </Tabs>

                <Box sx={{ p: 3 }}>
                    {/* Mapping Table Tab */}
                    {activeTab === 0 && (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{
                                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50'
                                    }}>
                                        <TableCell sx={{ fontWeight: 'bold', color: (theme) => theme.palette.mode === 'dark' ? 'grey.100' : 'grey.900' }}>
                                            NAMASTE (Traditional)
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: (theme) => theme.palette.mode === 'dark' ? 'grey.100' : 'grey.900' }}>
                                            ICD-11 TM2
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: (theme) => theme.palette.mode === 'dark' ? 'grey.100' : 'grey.900' }}>
                                            ICD-11 Biomedicine
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: (theme) => theme.palette.mode === 'dark' ? 'grey.100' : 'grey.900' }}>
                                            Confidence
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: (theme) => theme.palette.mode === 'dark' ? 'grey.100' : 'grey.900' }}>
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredMappings.map((mapping) => (
                                        <TableRow
                                            key={mapping.id}
                                            hover
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'action.hover'
                                                }
                                            }}
                                        >
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                                                        {mapping.namaste.term}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {mapping.namaste.english}
                                                    </Typography>
                                                    <Chip
                                                        label={mapping.namaste.code}
                                                        size="small"
                                                        color="primary"
                                                        sx={{ mt: 0.5 }}
                                                    />
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body1" fontWeight="bold">
                                                        {mapping.icd11TM2.term}
                                                    </Typography>
                                                    <Chip
                                                        label={mapping.icd11TM2.code}
                                                        size="small"
                                                        color="secondary"
                                                        sx={{ mt: 0.5 }}
                                                    />
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body1" fontWeight="bold">
                                                        {mapping.icd11Bio.term}
                                                    </Typography>
                                                    <Chip
                                                        label={mapping.icd11Bio.code}
                                                        size="small"
                                                        color="success"
                                                        sx={{ mt: 0.5 }}
                                                    />
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={getConfidenceLabel(mapping.confidence)}
                                                    color={getConfidenceColor(mapping.confidence)}
                                                    size="small"
                                                />
                                                <Typography variant="caption" display="block">
                                                    {(mapping.confidence * 100).toFixed(1)}%
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => {
                                                        setSelectedMapping(mapping);
                                                        setDetailsDialog(true);
                                                    }}
                                                    color="primary"
                                                >
                                                    <Visibility />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}


                    {/* Visual Mapping Tab */}
                    {activeTab === 1 && (
                        <Grid container spacing={2}>
                            {filteredMappings.map((mapping, index) => (
                                <Grid item xs={12} key={mapping.id}>
                                    <Card sx={{
                                        p: 1.5,
                                        border: '1px solid',
                                        borderColor: 'primary.main',
                                        borderRadius: 2,
                                        mb: 1
                                    }}>
                                        <Grid container spacing={1} alignItems="center">
                                            {/* NAMASTE */}
                                            <Grid item xs={12} md={3}>
                                                <Box sx={{
                                                    bgcolor: 'primary.50',
                                                    p: 1.5,
                                                    borderRadius: 1,
                                                    border: '1px solid',
                                                    borderColor: 'primary.main'
                                                }}>
                                                    <Typography variant="caption" color="primary" sx={{ fontSize: '0.7rem' }}>
                                                        Traditional (NAMASTE)
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                                        {mapping.namaste.term}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" display="block">
                                                        {mapping.namaste.english}
                                                    </Typography>
                                                    <Chip
                                                        label={mapping.namaste.code}
                                                        color="primary"
                                                        size="small"
                                                        sx={{ fontSize: '0.65rem', height: 18, mt: 0.5 }}
                                                    />
                                                </Box>
                                            </Grid>

                                            {/* Arrow */}
                                            <Grid item xs={12} md={1} sx={{ textAlign: 'center' }}>
                                                <Typography variant="h6" color="primary">→</Typography>
                                            </Grid>

                                            {/* ICD-11 TM2 */}
                                            <Grid item xs={12} md={3}>
                                                <Box sx={{
                                                    bgcolor: 'secondary.50',
                                                    p: 1.5,
                                                    borderRadius: 1,
                                                    border: '1px solid',
                                                    borderColor: 'secondary.main'
                                                }}>
                                                    <Typography variant="caption" color="secondary" sx={{ fontSize: '0.7rem' }}>
                                                        ICD-11 TM2
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                                        {mapping.icd11TM2.term}
                                                    </Typography>
                                                    <Chip
                                                        label={mapping.icd11TM2.code}
                                                        color="secondary"
                                                        size="small"
                                                        sx={{ fontSize: '0.65rem', height: 18, mt: 0.5 }}
                                                    />
                                                </Box>
                                            </Grid>

                                            {/* Arrow */}
                                            <Grid item xs={12} md={1} sx={{ textAlign: 'center' }}>
                                                <Typography variant="h6" color="success.main">→</Typography>
                                            </Grid>

                                            {/* ICD-11 Biomedicine */}
                                            <Grid item xs={12} md={3}>
                                                <Box sx={{
                                                    bgcolor: 'success.50',
                                                    p: 1.5,
                                                    borderRadius: 1,
                                                    border: '1px solid',
                                                    borderColor: 'success.main'
                                                }}>
                                                    <Typography variant="caption" color="success.main" sx={{ fontSize: '0.7rem' }}>
                                                        ICD-11 Biomedicine
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                                        {mapping.icd11Bio.term}
                                                    </Typography>
                                                    <Chip
                                                        label={mapping.icd11Bio.code}
                                                        color="success"
                                                        size="small"
                                                        sx={{ fontSize: '0.65rem', height: 18, mt: 0.5 }}
                                                    />
                                                </Box>
                                            </Grid>

                                            {/* Confidence */}
                                            <Grid item xs={12} md={1} sx={{ textAlign: 'center' }}>
                                                <Chip
                                                    label={`${Math.round(mapping.confidence * 100)}%`}
                                                    color="success"
                                                    size="small"
                                                    sx={{ fontSize: '0.65rem', height: 16 }}
                                                />
                                            </Grid>
                                        </Grid>

                                        {/* Search Terms */}
                                        <Box sx={{ mt: 1, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                                            <Typography variant="caption" sx={{ fontSize: '.8rem', mb: 0.5, display: 'block' }}>
                                                <strong>Search:</strong>
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.7 }}>
                                                {mapping.searchTerms.map((term, termIndex) => (
                                                    <Chip
                                                        key={termIndex}
                                                        label={term}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ fontSize: '.8rem', height: 16 }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {/* Search Examples Tab */}
                    {activeTab === 2 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h5" gutterBottom>
                                    Search Examples - Multi-language Support
                                </Typography>
                                <Alert severity="info" sx={{ mb: 3 }}>
                                    <Typography variant="body1">
                                        Our system supports searching in Sanskrit (Devanagari), transliteration, and English.
                                        Here are examples of how the same condition can be searched:
                                    </Typography>
                                </Alert>
                            </Grid>

                            {codingMappings.slice(0, 3).map((mapping, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom color="primary">
                                                {mapping.namaste.english}
                                            </Typography>
                                            <Divider sx={{ my: 2 }} />

                                            <Typography variant="subtitle2" gutterBottom>
                                                Search Options:
                                            </Typography>
                                            <List dense>
                                                {mapping.searchTerms.map((term, termIndex) => (
                                                    <ListItem key={termIndex}>
                                                        <ListItemIcon>
                                                            <Search color="action" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={term}
                                                            secondary={termIndex === 0 ? 'Sanskrit' :
                                                                termIndex === 1 ? 'Transliteration' : 'English'}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>

                                            <Divider sx={{ my: 2 }} />

                                            <Typography variant="subtitle2" gutterBottom>
                                                Mapped Codes:
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                <Chip label={`NAMASTE: ${mapping.namaste.code}`} color="primary" size="small" />
                                                <Chip label={`ICD-11 TM2: ${mapping.icd11TM2.code}`} color="secondary" size="small" />
                                                <Chip label={`ICD-11 Bio: ${mapping.icd11Bio.code}`} color="success" size="small" />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Paper>

            {/* Details Dialog */}
            <Dialog open={detailsDialog} onClose={() => setDetailsDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Typography variant="h6">Complete Mapping Details</Typography>
                </DialogTitle>
                <DialogContent>
                    {selectedMapping && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Typography variant="h6" color="primary" gutterBottom>
                                    NAMASTE (Traditional)
                                </Typography>
                                <Typography><strong>Code:</strong> {selectedMapping.namaste.code}</Typography>
                                <Typography><strong>Sanskrit:</strong> {selectedMapping.namaste.term}</Typography>
                                <Typography><strong>English:</strong> {selectedMapping.namaste.english}</Typography>
                                <Typography><strong>System:</strong> {selectedMapping.namaste.system}</Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    {selectedMapping.namaste.definition}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Typography variant="h6" color="secondary" gutterBottom>
                                    ICD-11 TM2
                                </Typography>
                                <Typography><strong>Code:</strong> {selectedMapping.icd11TM2.code}</Typography>
                                <Typography><strong>Term:</strong> {selectedMapping.icd11TM2.term}</Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    {selectedMapping.icd11TM2.definition}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Typography variant="h6" color="success" gutterBottom>
                                    ICD-11 Biomedicine
                                </Typography>
                                <Typography><strong>Code:</strong> {selectedMapping.icd11Bio.code}</Typography>
                                <Typography><strong>Term:</strong> {selectedMapping.icd11Bio.term}</Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    {selectedMapping.icd11Bio.definition}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                    Additional Information
                                </Typography>
                                <Typography><strong>WHO Terminology:</strong> {selectedMapping.whoTerminology}</Typography>
                                <Typography><strong>Mapping Confidence:</strong> {(selectedMapping.confidence * 100).toFixed(1)}%</Typography>
                                <Typography><strong>Search Terms:</strong> {selectedMapping.searchTerms.join(', ')}</Typography>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailsDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MedicalCodingMapping;