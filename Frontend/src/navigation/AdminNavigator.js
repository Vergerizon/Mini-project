import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, StyleSheet } from 'react-native';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import UserListScreen from '../screens/admin/UserListScreen';
import AddUserScreen from '../screens/admin/AddUserScreen';

// Shared Screens
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

// Tab Icon
const TabIcon = ({ label, focused, color }) => (
  <View style={styles.iconContainer}>
    <Text style={[styles.iconText, { color }]}>{label.charAt(0)}</Text>
  </View>
);

// Dashboard Stack (Admin)
function DashboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="DashboardMain" 
        component={AdminDashboardScreen}
        options={{ title: 'Dashboard Admin' }}
      />
    </Stack.Navigator>
  );
}

// Users Stack (Admin Only)
function UsersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="UserList" 
        component={UserListScreen}
        options={{ title: 'Kelola User' }}
      />
      <Stack.Screen 
        name="AddUser" 
        component={AddUserScreen}
        options={{ title: 'Tambah User' }}
      />
      <Stack.Screen 
        name="EditUser" 
        component={AddUserScreen}
        options={{ title: 'Edit User' }}
      />
    </Stack.Navigator>
  );
}

// Transaction Stack
function TransactionStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="TransactionList" 
        component={TransactionListScreen}
        options={{ title: 'Transaksi' }}
      />
      <Stack.Screen 
        name="TransactionDetail" 
        component={TransactionDetailScreen}
        options={{ title: 'Detail Transaksi' }}
      />
      <Stack.Screen 
        name="AddTransaction" 
        component={AddTransactionScreen}
        options={{ title: 'Transaksi Baru' }}
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
        options={{ title: 'Kategori' }}
      />
      <Stack.Screen 
        name="CategoryDetail" 
        component={CategoryDetailScreen}
        options={{ title: 'Detail Kategori' }}
      />
      <Stack.Screen 
        name="AddCategory" 
        component={AddCategoryScreen}
        options={({ route }) => ({
          title: route.params?.category ? 'Edit Kategori' : 'Kategori Baru',
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
        options={{ title: 'Produk' }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{ title: 'Detail Produk' }}
      />
      <Stack.Screen 
        name="AddProduct" 
        component={AddProductScreen}
        options={({ route }) => ({
          title: route.params?.product ? 'Edit Produk' : 'Produk Baru',
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
        options={{ title: 'Laporan' }}
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
        options={{ title: 'Profil' }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ title: 'Edit Profil' }}
      />
      <Stack.Screen 
        name="ChangePassword" 
        component={ChangePasswordScreen}
        options={{ title: 'Ubah Password' }}
      />
    </Stack.Navigator>
  );
}

export default function AdminNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => (
          <TabIcon label={route.name} focused={focused} color={color} />
        ),
        tabBarActiveTintColor: '#1a237e',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 10,
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardStack}
        options={{
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen 
        name="Users" 
        component={UsersStack}
        options={{
          tabBarLabel: 'Users',
        }}
      />
      <Tab.Screen 
        name="Transactions" 
        component={TransactionStack}
        options={{
          tabBarLabel: 'Transaksi',
        }}
      />
      <Tab.Screen 
        name="Categories" 
        component={CategoryStack}
        options={{
          tabBarLabel: 'Kategori',
        }}
      />
      <Tab.Screen 
        name="Products" 
        component={ProductStack}
        options={{
          tabBarLabel: 'Produk',
        }}
      />
      <Tab.Screen 
        name="Reports" 
        component={ReportStack}
        options={{
          tabBarLabel: 'Laporan',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profil',
        }}
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
    fontSize: 14,
    fontWeight: 'bold',
  },
});
