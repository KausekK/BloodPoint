import {
  Box,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const faqs = [
  {
    question: 'Gdzie oddać krew?',
    answer: 'Możesz oddać krew w najbliższym punkcie krwiodawstwa. Sprawdź listę punktów na naszej stronie.'
  },
  {
    question: 'W jakich odstępach czasu mogę oddać krew?',
    answer: 'Mężczyźni mogą oddawać krew co 8 tygodni, kobiety co 12 tygodni.'
  },
  {
    question: 'Czy będąc w ciąży mogę oddać krew?',
    answer: 'Nie – pobranie krwi nie jest dozwolone w czasie ciąży ani przez 6 miesięcy po porodzie.'
  },
  {
    question: 'Jak się przygotować do oddania krwi?',
    answer: 'Dzień wcześniej zjedz lekki, bogaty w żelazo posiłek i zadbaj o odpowiednie nawodnienie.'
  },
  {
    question: 'Od jakiego wieku mogę oddać krew?',
    answer: 'Musisz mieć skończone 18 lat i wagę powyżej 50 kg.'
  },
  {
    question: 'Jakie przywileje przysługują krwiodawcom?',
    answer: 'Prawo do zwolnienia od pracy, zniżki na leki, bezpłatne badania profilaktyczne i inne.'
  }
];

export default function Footer() {
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
            Designed by Ola and Kuba
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Regionalny System Krwiodawstwa i Krwiolecznictwa
          </Typography>
        </Box>

        <Box sx={{ width: { xs: '100%', md: '60%' } }}>
          <Typography
            variant="h5"
            component="h2"
            color="error.main"
            gutterBottom
          >
            FAQs
          </Typography>
          <Divider sx={{ mb: 2, borderColor: 'divider' }} />

          {faqs.map(({ question, answer }) => (
            <Accordion key={question} disableGutters>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon color="error" />}
                aria-controls={`${question}-content`}
                id={`${question}-header`}
              >
                <Typography variant="body2">
                  {question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </Box>
  );
}