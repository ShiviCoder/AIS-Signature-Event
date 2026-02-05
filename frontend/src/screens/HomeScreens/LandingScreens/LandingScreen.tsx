import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  FlatList,
  Dimensions,
} from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { color } from '../../../utils/color/color'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width } = Dimensions.get('window')

const LandingScreen = ({ navigation }) => {
  const featuredEvents = [
     {
      id: '1',
      title: 'Wedding Events',
      image: 'https://images.squarespace-cdn.com/content/v1/6627d116ba2358384fb2b475/7f9aa6fc-37ca-4ea1-87a6-4f404ab06114/Indian+Weddings+at+Hard+Rock+Hotel+Los+Cabos+79+-+Web.jpg',
    },
     {
      id: '2',
      title: 'Religious Events',
      image: 'https://static.bangkokpost.com/media/content/20250929/c1_5797786_800.jpg',
    },
    {
      id: '3',
      title: 'Music Festival 2024',
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    },
    {
      id: '4',
      title: 'Tech Conference',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w-800',
    },
    {
        id: '5',
        title : 'Sports Events',
        image : 'https://www.zuerich.com/sites/default/files/styles/1920_1244_focal_scale_crop/public/keyvisual/web_zuerich_weltklasse_1600x900_1.jpg?h=2020-08-14T16:41:13+02:00'
    },
     {
        id : '6',
        title : 'Social Events',
        image : 'https://d34ad2g4hirisc.cloudfront.net/volunteer_positions/photos/000/031/235/original/6da72621b88d3b607a9009333a3c02ea.jpg'
     }
   
  ]


const categories = [
  { 
    id: '1', 
    name: 'Wedding & Pre-Wedding', 
    icon: 'heart-circle', 
    color: '#FF69B4' 
  },
  { 
    id: '2', 
    name: 'Birthday', 
    icon: 'gift',               
    color: '#FF6B6B' 
  },
  { 
    id: '3', 
    name: 'Corporate', 
    icon: 'business',          
    color: '#4ECDC4' 
  },
  { 
    id: '4', 
    name: 'Public & Entertainment', 
    icon: 'ticket',             
    color: '#FFD166' 
  },
  { 
    id: '5', 
    name: 'Religious & Cultural', 
    icon: 'heart-half',         
    color: '#06D6A0' 
  },
  { 
    id: '6', 
    name: 'Online & Hybrid', 
    icon: 'desktop',            
    color: '#118AB2' 
  },
  { 
    id: '7', 
    name: 'Music', 
    icon: 'musical-notes', 
    color: '#9370DB' 
  },
  { 
    id: '8', 
    name: 'Sports', 
    icon: 'basketball', 
    color: '#FF8C00' 
  },
  { 
    id: '9', 
    name: 'Food & Dining', 
    icon: 'restaurant', 
    color: '#FF6347' 
  },
  { 
    id: '10', 
    name: 'Education', 
    icon: 'school', 
    color: '#2E8B57' 
  },
];

  const EventCard = ({ event }) => (
    <TouchableOpacity style={styles.eventCard}>
      <View style={styles.eventImageContainer}>
        <Image 
          source={{ uri: event.image }} 
          style={styles.eventImage}
        />
        <View style={styles.eventCategoryTag}>
          <Text style={styles.eventCategoryText}>{event.title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const CategoryCard = ({ category }) => (
    <TouchableOpacity style={[styles.categoryCard, { backgroundColor: category.color}]}>
      <View style={[styles.categoryIcon, { backgroundColor: color.white }]}>
        <Icon name={category.icon} size={28} color={category.color} />
      </View>
      <Text style={styles.categoryName}>{category.name}</Text>
    </TouchableOpacity>
  )
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Welcome!</Text>
            <Text style={styles.subGreeting}>Discover amazing events around you</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="notifications-outline" size={24} color={color.primary} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        

        {/* Featured Events Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Events</Text>
          </View>
          <FlatList
            data={featuredEvents}
            renderItem={({ item }) => <EventCard event={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.eventsList}
          />
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse Categories</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default LandingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: color.primary,
  },
  subGreeting: {
    fontSize: 14,
    color: color.textDisabled,
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: color.primary,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: color.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  section: {
    marginVertical: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.textSecondary,
  },
  seeAllText: {
    color: color.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  eventsList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  eventCard: {
    width: width * 0.7,
    backgroundColor: color.white,
    borderRadius: 16,
    marginRight: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginBottom : 5
  },
  eventImageContainer: {
    height: 160,
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  eventCategoryTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: color.white ,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  eventCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: color.primary,
  },
  eventPriceTag: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: color.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  eventPriceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: color.white,
  },
  eventInfo: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: color.primary,
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventMetaText: {
    fontSize: 12,
    color: color.textDisabled,
    marginLeft: 6,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: color.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '500',
    color: color.text,
    textAlign: 'center',
  },
  upcomingBanner: {
    backgroundColor: color.primary,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: color.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    color: color.white + 'CC',
    fontWeight: '600',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.white,
    marginBottom: 12,
  },
  bannerMeta: {
    flexDirection: 'row',
  },
  bannerMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  bannerMetaText: {
    fontSize: 12,
    color: color.white + 'CC',
    marginLeft: 6,
  },
  bannerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.white + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bannerCtaText: {
    color: color.white,
    fontWeight: '600',
    marginRight: 6,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: color.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionText: {
    fontSize: 12,
    color: color.textSecondary,
    fontWeight: '500',
  },
})