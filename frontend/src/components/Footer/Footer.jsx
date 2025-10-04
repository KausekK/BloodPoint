import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import footerContent from '../../content/Footer/footer.json';

export default function Footer() {
  const { brand, faqsTitle, faqs } = footerContent;

  if (!faqs || !faqs.length) return null;

  return (
      <Box
          component="footer"
          sx={{
            backgroundColor: 'background.paper',
            py: 6,
            px: { xs: 2, md: 8 },
            borderTop: 1,
            borderColor: 'divider'
          }}
      >
        <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'flex-start' },
            }}
        >
          <Box sx={{ mb: { xs: 4, md: 0 }, maxWidth: 300 }}>
            <Typography variant="body1" fontWeight="bold">
              {brand?.designer}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {brand?.subtitle}
            </Typography>
          </Box>

          <Box sx={{ width: { xs: '100%', md: '60%' } }}>
            <Typography
                variant="h5"
                component="h2"
                color="error.main"
                gutterBottom
            >
              {faqsTitle}
            </Typography>
            <Divider sx={{ mb: 2, borderColor: 'divider' }} />

            {faqs.map((item, idx) => (
                <Accordion key={idx} disableGutters>
                  <AccordionSummary
                      expandIcon={<ExpandMoreIcon color="error" />}
                      aria-controls={`faq-${idx}-content`}
                      id={`faq-${idx}-header`}
                  >
                    <Typography variant="body2">
                      {item.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                      {item.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
            ))}
          </Box>
        </Box>
      </Box>
  );
}
