import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, StyleSheet } from 'react-native';

// Screens
import TransactionListScreen from '../screens/transaction/TransactionListScreen';
import TransactionDetailScreen from '../screens/transaction/TransactionDetailScreen';
import AddTransactionScreen from '../screens/transaction/AddTransactionScreen';

import CategoryListScreen from '../screens/category/CategoryListScreen';
import CategoryDetailScreen from '../screens/category/CategoryDetailScreen';
import AddCategoryScreen from '../screens/category/AddCategoryScreen';

import ProductListScreen from '../screens/product/ProductListScreen';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';
import AddProductScreen from '../screens/product/AddProductScreen';

import ReportScreen from '../screens/report/ReportScreen';

import ProfileScreen from '../screens/user/ProfileScreen';
import EditProfileScreen from '../screens/user/EditProfileScreen';
import ChangePasswordScreen from '../screens/user/ChangePasswordScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Simple icon component
const TabIcon = ({ label, focused }) => (
  <View style={styles.iconContainer}>
    <Text style={[styles.iconText, focused && styles.iconTextFocused]}>
      {label.charAt(0)}
    </Text>
  </View>
);

// Transaction Stack
function TransactionStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="TransactionList" 
        component={TransactionListScreen}
        options={{ title: 'Transactions' }}
      />
      <Stack.Screen 
        name="TransactionDetail" 
        component={TransactionDetailScreen}
        options={{ title: 'Transaction Details' }}
      />
      <Stack.Screen 
        name="AddTransaction" 
        component={AddTransactionScreen}
        options={{ title: 'New Transaction' }}
      />
    </Stack.Navigator>
  );
}

// Category Stack
function CategoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CategoryList" 
        component={CategoryListScreen}
        options={{ title: 'Categories' }}
      />
      <Stack.Screen 
        name="CategoryDetail" 
        component={CategoryDetailScreen}
        options={{ title: 'Category Details' }}
      />
      <Stack.Screen 
        name="AddCategory" 
        component={AddCategoryScreen}
        options={({ route }) => ({
          title: route.params?.category ? 'Edit Category' : 'New Category',
        })}
      />
    </Stack.Navigator>
  );
}

// Product Stack
function ProductStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProductList" 
        component={ProductListScreen}
        options={{ title: 'Products' }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{ title: 'Product Details' }}
      />
      <Stack.Screen 
        name="AddProduct" 
        component={AddProductScreen}
        options={({ route }) => ({
          title: route.params?.product ? 'Edit Product' : 'New Product',
        })}
      />
    </Stack.Navigator>
  );
}

// Report Stack
function ReportStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ReportMain" 
        component={ReportScreen}
        options={{ title: 'Reports' }}
      />
    </Stack.Navigator>
  );
}

// Profile Stack
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
      <Stack.Screen 
        name="ChangePassword" 
        component={ChangePasswordScreen}
        options={{ title: 'Change Password' }}
      />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon label={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: '#1a73e8',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen 
        name="Transactions" 
        component={TransactionStack}
      />
      <Tab.Screen 
        name="Categories" 
        component={CategoryStack}
      />
      <Tab.Screen 
        name="Products" 
        component={ProductStack}
      />
      <Tab.Screen 
        name="Reports" 
        component={ReportStack}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
  },
  iconTextFocused: {
    color: '#1a73e8',
  },
});
