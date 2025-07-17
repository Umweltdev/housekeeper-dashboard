import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetEvent } from 'src/api/events';
import { PRODUCT_PUBLISH_OPTIONS } from 'src/_mock';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';

import PostDetailsHero from 'src/sections/blog/post-details-hero';

import { ProductDetailsSkeleton } from '../product-skeleton';
import ProductDetailsToolbar from '../product-details-toolbar';

// ----------------------------------------------------------------------

const SUMMARY = [
  {
    title: '100% Original',
    description: 'Chocolate bar candy canes ice cream toffee cookie halvah.',
    icon: 'solar:verified-check-bold',
  },
  {
    title: '10 Day Replacement',
    description: 'Marshmallow biscuit donut dragée fruitcake wafer.',
    icon: 'solar:clock-circle-bold',
  },
  {
    title: 'Year Warranty',
    description: 'Cotton candy gingerbread cake I love sugar sweet.',
    icon: 'solar:shield-check-bold',
  },
];

// ----------------------------------------------------------------------

export default function ProductDetailsView({ slug }) {
  const { event, eventLoading, eventError } = useGetEvent(slug);

  const settings = useSettingsContext();

  const [publish, setPublish] = useState('');

  useEffect(() => {
    if (event) {
      setPublish(event?.publish);
    }
  }, [event]);

  const handleChangePublish = useCallback((newValue) => {
    setPublish(newValue);
  }, []);

  // const handleChangeTab = useCallback((event, newValue) => {
  //   setCurrentTab(newValue);
  // }, []);

  const renderSkeleton = <ProductDetailsSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${eventError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.dashboard.event.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Back to List
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderProduct = event && (
    <>
      <ProductDetailsToolbar
        // backLink={paths.dashboard.event.root}
        // editLink={paths.dashboard.event.edit(`${event?.slug}`)}
        // liveLink={paths.event.details(`${event?.slug}`)}
        backLink={paths.dashboard.event.root}
        editLink={paths.dashboard.event.edit(`${event?._id}`)}
        liveLink={paths.event.details(`${event?.title}`)}
        publish={publish || ''}
        onChangePublish={handleChangePublish}
        publishOptions={PRODUCT_PUBLISH_OPTIONS}
      />
      <PostDetailsHero title={event?.title} coverUrl={event?.image} />

      <Stack
        sx={{
          maxWidth: 720,
          mx: 'auto',
          mt: { xs: 5, md: 10 },
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 5 }}>
          {event.description}
        </Typography>

        <div
          className="mt-[20px] mr-5 xl:text-[20px] sm:text-[18px] text-[16px]"
          dangerouslySetInnerHTML={{
            __html: event?.content,
          }}
        />
      </Stack>
      {/* <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <ProductDetailsCarousel product={product} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          <ProductDetailsSummary disabledActions product={product} />
        </Grid>
      </Grid> */}

      {/* <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        sx={{ my: 10 }}
      >
        {SUMMARY.map((item) => (
          <Box key={item.title} sx={{ textAlign: 'center', px: 5 }}>
            <Iconify icon={item.icon} width={32} sx={{ color: 'primary.main' }} />

            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
              {item.title}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box> */}

      {/* <Card>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 3,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {[
            {
              value: 'description',
              label: 'Description',
            },
            {
              value: 'reviews',
              label: `Reviews (${product.reviews.length})`,
            },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {currentTab === 'description' && (
          <ProductDetailsDescription description={product?.description} />
        )}

        {currentTab === 'reviews' && (
          <ProductDetailsReview
            ratings={product.ratings}
            reviews={product.reviews}
            totalRatings={product.totalRatings}
            totalReviews={product.totalReviews}
          />
        )}
      </Card> */}
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {eventLoading && renderSkeleton}

      {eventError && renderError}

      {event && renderProduct}
    </Container>
  );
}

ProductDetailsView.propTypes = {
  slug: PropTypes.string,
};
