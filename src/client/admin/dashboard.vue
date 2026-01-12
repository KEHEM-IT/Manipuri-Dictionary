<!-- src/client/admin/dashboard.vue -->
<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Responsive Navbar -->
    <nav class="bg-gray-800 shadow-lg sticky top-0 z-50 border-b border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and Brand -->
          <div class="flex items-center">
            <button
              @click="toggleSidebar"
              class="lg:hidden p-2 rounded-md text-gray-300 hover:bg-gray-700 mr-2"
            >
              <i class="fas fa-bars text-xl"></i>
            </button>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <i class="fas fa-book text-white text-lg"></i>
              </div>
              <div>
                <h1 class="text-xl font-bold text-white">Bishnupriya Manipuri</h1>
                <p class="text-xs text-gray-400">Dictionary Admin Panel</p>
              </div>
            </div>
          </div>

          <!-- Right Side Actions -->
          <div class="flex items-center space-x-4">
            <!-- Search -->
            <div class="hidden md:block relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search..."
                class="w-64 px-4 py-2 pl-10 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>

            <!-- Notifications -->
            <button class="relative p-2 rounded-lg hover:bg-gray-700 text-gray-300">
              <i class="fas fa-bell text-xl"></i>
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <!-- User Menu -->
            <div class="relative">
              <button
                @click="toggleUserMenu"
                class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700"
              >
                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <i class="fas fa-user text-white text-sm"></i>
                </div>
                <i class="fas fa-chevron-down text-gray-300 text-sm"></i>
              </button>
              
              <!-- Dropdown Menu -->
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl py-2 border border-gray-700"
              >
                <div class="px-4 py-3 border-b border-gray-700">
                  <p class="text-sm text-gray-400">Signed in as</p>
                  <p class="text-sm font-medium text-white truncate">{{ currentUser?.username }}</p>
                </div>
                <a href="#" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                  <i class="fas fa-user-circle mr-2"></i>Profile
                </a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                  <i class="fas fa-cog mr-2"></i>Settings
                </a>
                <hr class="my-2 border-gray-700">
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                >
                  <i class="fas fa-sign-out-alt mr-2"></i>Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Search -->
      <div class="md:hidden px-4 pb-3">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search..."
            class="w-full px-4 py-2 pl-10 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400"
          />
          <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>
    </nav>

    <div class="flex">
      <!-- Sidebar -->
      <aside
        :class="[
          'fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out mt-16 lg:mt-0 border-r border-gray-700',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        ]"
      >
        <div class="h-full overflow-y-auto py-6 px-4">
          <nav class="space-y-2">
            <a
              v-for="item in menuItems"
              :key="item.name"
              href="#"
              @click.prevent="activeMenu = item.name"
              :class="[
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                activeMenu === item.name
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700'
              ]"
            >
              <i :class="['fas', item.icon, 'w-5 text-center']"></i>
              <span class="font-medium">{{ item.name }}</span>
            </a>
          </nav>

          <!-- Sidebar Footer -->
          <div class="mt-8 p-4 bg-gray-700 rounded-lg border border-gray-600">
            <div class="flex items-center space-x-2 mb-2">
              <i class="fas fa-info-circle text-blue-400"></i>
              <span class="text-sm font-semibold text-gray-200">System Status</span>
            </div>
            <p class="text-xs text-gray-400">All systems operational</p>
            <div class="mt-2 flex items-center space-x-1">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-xs text-green-400">Online</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Mobile Sidebar Overlay -->
      <div
        v-if="isSidebarOpen"
        @click="toggleSidebar"
        class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden mt-16"
      ></div>

      <!-- Main Content -->
      <main class="flex-1 p-6 lg:p-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            v-for="stat in stats"
            :key="stat.title"
            class="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow border border-gray-700"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm text-gray-400 mb-1">{{ stat.title }}</p>
                <h3 class="text-3xl font-bold text-white mb-2">{{ stat.value }}</h3>
                <p :class="['text-sm flex items-center space-x-1', stat.change >= 0 ? 'text-green-400' : 'text-red-400']">
                  <i :class="['fas', stat.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
                  <span>{{ Math.abs(stat.change) }}%</span>
                  <span class="text-gray-500">vs last month</span>
                </p>
              </div>
              <div :class="['p-4 rounded-full', stat.bgColor]">
                <i :class="['fas', stat.icon, 'text-2xl', stat.iconColor]"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity & Quick Actions -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <!-- Quick Actions -->
          <div class="lg:col-span-1 bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
              <i class="fas fa-bolt text-yellow-400 mr-2"></i>
              Quick Actions
            </h3>
            <div class="space-y-3">
              <button
                v-for="action in quickActions"
                :key="action.name"
                class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg border-2 border-gray-600 hover:border-blue-500 hover:bg-gray-700 transition-all text-left"
              >
                <i :class="['fas', action.icon, 'text-blue-400']"></i>
                <span class="text-gray-300 font-medium">{{ action.name }}</span>
              </button>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="lg:col-span-2 bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
              <i class="fas fa-clock text-blue-400 mr-2"></i>
              Recent Activity
            </h3>
            <div class="space-y-4 max-h-80 overflow-y-auto">
              <div
                v-for="activity in recentActivities"
                :key="activity.id"
                class="flex items-start space-x-3 pb-4 border-b border-gray-700 last:border-0"
              >
                <div :class="['w-8 h-8 rounded-full flex items-center justify-center', activity.bgColor]">
                  <i :class="['fas', activity.icon, 'text-white text-sm']"></i>
                </div>
                <div class="flex-1">
                  <p class="text-sm text-white font-medium">{{ activity.action }}</p>
                  <p class="text-xs text-gray-500 mt-1">
                    <i class="far fa-clock mr-1"></i>{{ activity.time }}
                  </p>
                </div>
                <span :class="['text-xs px-2 py-1 rounded', activity.badgeClass]">
                  {{ activity.type }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Dictionary Stats Table -->
        <div class="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
          <div class="p-6 border-b border-gray-700">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-white flex items-center">
                <i class="fas fa-table text-blue-400 mr-2"></i>
                Recent Entries
              </h3>
              <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                <i class="fas fa-plus mr-2"></i>Add New
              </button>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <i class="fas fa-language mr-2"></i>Word
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <i class="fas fa-text-width mr-2"></i>Translation
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <i class="fas fa-tag mr-2"></i>Category
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <i class="fas fa-circle-check mr-2"></i>Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <i class="fas fa-calendar mr-2"></i>Date
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <i class="fas fa-cog mr-2"></i>Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-700">
                <tr
                  v-for="entry in recentEntries"
                  :key="entry.id"
                  class="hover:bg-gray-700 transition-colors"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{{ entry.word }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{{ entry.translation }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <span class="px-2 py-1 bg-gray-700 rounded text-xs">{{ entry.category }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="['px-2 py-1 text-xs rounded-full flex items-center w-fit space-x-1', entry.statusClass]">
                      <i :class="['fas', entry.statusIcon, 'text-xs']"></i>
                      <span>{{ entry.status }}</span>
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <i class="far fa-calendar mr-1"></i>{{ entry.date }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button class="text-blue-400 hover:text-blue-300 transition-colors">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-green-400 hover:text-green-300 transition-colors">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="text-red-400 hover:text-red-300 transition-colors">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div class="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
            <p class="text-sm text-gray-400">
              Showing <span class="font-medium text-white">1-5</span> of <span class="font-medium text-white">50</span> entries
            </p>
            <div class="flex space-x-2">
              <button class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button class="px-3 py-1 bg-blue-600 text-white rounded">1</button>
              <button class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors">2</button>
              <button class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors">3</button>
              <button class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminAuth } from '../composables/admin/useAdminAuth';

// State
const isSidebarOpen = ref(false);
const showUserMenu = ref(false);
const searchQuery = ref('');
const activeMenu = ref('Dashboard');

// Auth
const { logout, getCurrentUser } = useAdminAuth();
const currentUser = ref(getCurrentUser());

// Menu items
const menuItems = [
  { name: 'Dashboard', icon: 'fa-home' },
  { name: 'Dictionary', icon: 'fa-book' },
  { name: 'Users', icon: 'fa-users' },
  { name: 'Analytics', icon: 'fa-chart-line' },
  { name: 'Settings', icon: 'fa-cog' },
];

// Stats data
const stats = ref([
  {
    title: 'Total Words',
    value: '2,547',
    change: 12.5,
    icon: 'fa-book',
    bgColor: 'bg-blue-900',
    iconColor: 'text-blue-400'
  },
  {
    title: 'Active Users',
    value: '1,284',
    change: 8.2,
    icon: 'fa-users',
    bgColor: 'bg-green-900',
    iconColor: 'text-green-400'
  },
  {
    title: 'Daily Searches',
    value: '456',
    change: -3.1,
    icon: 'fa-search',
    bgColor: 'bg-yellow-900',
    iconColor: 'text-yellow-400'
  },
  {
    title: 'New Entries',
    value: '34',
    change: 15.8,
    icon: 'fa-plus',
    bgColor: 'bg-purple-900',
    iconColor: 'text-purple-400'
  },
]);

// Quick actions
const quickActions = [
  { name: 'Add New Word', icon: 'fa-plus' },
  { name: 'Import CSV', icon: 'fa-upload' },
  { name: 'Export Data', icon: 'fa-download' },
  { name: 'View Reports', icon: 'fa-chart-bar' },
];

// Recent activities
const recentActivities = ref([
  {
    id: 1,
    action: 'New word "মানুহ" added to dictionary',
    time: '2 minutes ago',
    type: 'Add',
    icon: 'fa-plus',
    bgColor: 'bg-green-600',
    badgeClass: 'bg-green-900 text-green-300'
  },
  {
    id: 2,
    action: 'User "admin@example.com" updated translation',
    time: '15 minutes ago',
    type: 'Update',
    icon: 'fa-edit',
    bgColor: 'bg-blue-600',
    badgeClass: 'bg-blue-900 text-blue-300'
  },
  {
    id: 3,
    action: 'Deleted duplicate entry "ঘর"',
    time: '1 hour ago',
    type: 'Delete',
    icon: 'fa-trash',
    bgColor: 'bg-red-600',
    badgeClass: 'bg-red-900 text-red-300'
  },
  {
    id: 4,
    action: 'Bulk import completed: 50 words',
    time: '3 hours ago',
    type: 'Import',
    icon: 'fa-upload',
    bgColor: 'bg-purple-600',
    badgeClass: 'bg-purple-900 text-purple-300'
  },
  {
    id: 5,
    action: 'Database backup completed successfully',
    time: '5 hours ago',
    type: 'System',
    icon: 'fa-database',
    bgColor: 'bg-gray-600',
    badgeClass: 'bg-gray-700 text-gray-300'
  },
]);

// Recent entries
const recentEntries = ref([
  {
    id: 1,
    word: 'মানুহ',
    translation: 'Person, Human',
    category: 'Noun',
    status: 'Published',
    statusIcon: 'fa-circle-check',
    statusClass: 'bg-green-900 text-green-300',
    date: '2025-01-12'
  },
  {
    id: 2,
    word: 'ঘর',
    translation: 'House, Home',
    category: 'Noun',
    status: 'Published',
    statusIcon: 'fa-circle-check',
    statusClass: 'bg-green-900 text-green-300',
    date: '2025-01-12'
  },
  {
    id: 3,
    word: 'খাৱা',
    translation: 'To Eat',
    category: 'Verb',
    status: 'Draft',
    statusIcon: 'fa-pen',
    statusClass: 'bg-yellow-900 text-yellow-300',
    date: '2025-01-11'
  },
  {
    id: 4,
    word: 'বুৎ',
    translation: 'Good',
    category: 'Adjective',
    status: 'Review',
    statusIcon: 'fa-hourglass-half',
    statusClass: 'bg-blue-900 text-blue-300',
    date: '2025-01-11'
  },
  {
    id: 5,
    word: 'পানী',
    translation: 'Water',
    category: 'Noun',
    status: 'Published',
    statusIcon: 'fa-circle-check',
    statusClass: 'bg-green-900 text-green-300',
    date: '2025-01-10'
  },
]);

// Methods
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const handleLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    logout();
  }
};

// Initialize
onMounted(() => {
  currentUser.value = getCurrentUser();
});
</script>
