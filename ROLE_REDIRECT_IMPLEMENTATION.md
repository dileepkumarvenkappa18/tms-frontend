# Role-Based Landing Page Redirects Implementation

## Overview
This implementation provides a comprehensive role-based redirect system that automatically redirects authenticated users to their appropriate dashboards when they visit the root path (`/`) or landing page.

## Features Implemented

### 1. Centralized Redirect Logic
- **File**: `src/utils/redirectHelpers.js`
- **Purpose**: Centralized utility functions for role-based redirects 
- **Key Functions**:
  - `getRoleBasedRedirectPath(userRole, user)` - Main redirect logic
  - `isValidPathForRole(path, role)` - Path validation
  - `shouldRedirectFromRoute(currentPath, userRole, user)` - Redirect detection

### 2. Router-Level Redirects
- **File**: `src/router/index.js`
- **Implementation**: Router guard that intercepts authenticated users visiting root path
- **Behavior**: Automatically redirects based on user role before component rendering

### 3. Landing Page Redirects
- **File**: `src/views/public/LandingPage.vue`
- **Implementation**: Component-level redirect for authenticated users
- **Behavior**: Checks authentication status on mount and redirects accordingly

### 4. App-Level Redirects
- **File**: `src/App.vue`
- **Implementation**: Global authentication handling with role-based redirects
- **Behavior**: Handles redirects during app initialization and auth state changes

## Supported User Roles and Redirects

### 1. Super Admin
- **Role**: `superadmin`, `super_admin`
- **Redirect**: `/superadmin/dashboard`
- **Purpose**: Full system access and management

### 2. Tenant/Temple Admin
- **Role**: `tenant`, `templeadmin`
- **Redirect**: `/tenant/{tenantId}/dashboard` or `/tenant/dashboard`
- **Purpose**: Temple management and administration

### 3. Devotee
- **Role**: `devotee`
- **Redirect**: 
  - With entity: `/entity/{entityId}/devotee/dashboard`
  - Without entity: `/devotee/temple-selection`
- **Purpose**: Temple member access and seva booking

### 4. Volunteer
- **Role**: `volunteer`
- **Redirect**:
  - With entity: `/entity/{entityId}/volunteer/dashboard`
  - Without entity: `/volunteer/temple-selection`
- **Purpose**: Volunteer management and assignments

### 5. Standard User
- **Role**: `standard_user`, `standarduser`
- **Redirect**:
  - With assigned tenant: `/tenant/{assignedTenantId}/dashboard`
  - Without assigned tenant: `/tenant-selection`
- **Purpose**: Multi-tenant access for standard users

### 6. Monitoring User
- **Role**: `monitoring_user`, `monitoringuser`
- **Redirect**:
  - With assigned tenant: `/tenant/{assignedTenantId}/dashboard`
  - Without assigned tenant: `/tenant-selection`
- **Purpose**: Monitoring and oversight access

### 7. Entity Admin
- **Role**: `entity_admin`
- **Redirect**:
  - With entity: `/entity/{entityId}/dashboard`
  - Without entity: `/tenant/dashboard`
- **Purpose**: Entity-specific administration

## Implementation Details

### Redirect Priority
1. **Router Guard** (Highest Priority)
   - Intercepts before component rendering
   - Most efficient for performance

2. **Component-Level** (Medium Priority)
   - Handles cases where router guard might miss
   - Provides fallback redirect logic

3. **App-Level** (Lowest Priority)
   - Global authentication state management
   - Handles edge cases and initialization

### Data Sources for Redirects
- **User Role**: From `authStore.userRole`
- **User Data**: From `authStore.user`
- **Tenant ID**: From `user.id` or `localStorage.current_tenant_id`
- **Assigned Tenant**: From `localStorage.assigned_tenant_id`
- **Entity ID**: From `user.entityId` or `user.current_entity.id`

### Error Handling
- **Unknown Roles**: Redirect to `/login`
- **Missing Data**: Graceful fallbacks to appropriate selection pages
- **Invalid States**: Fallback to login page

## Testing

### Test File
- **File**: `src/utils/__tests__/redirectHelpers.test.js`
- **Coverage**: All user roles and edge cases
- **Validation**: Path validation and redirect logic

### Test Cases Covered
1. All supported user roles
2. Users with and without entities
3. Users with and without assigned tenants
4. Path validation for each role
5. Edge cases and error conditions

## Usage Examples

### For Developers
```javascript
import { getRoleBasedRedirectPath } from '@/utils/redirectHelpers'

// Get redirect path for a user
const redirectPath = getRoleBasedRedirectPath(userRole, user)
router.push(redirectPath)
```

### For Testing
```javascript
// Run the test file to see all redirect scenarios
node src/utils/__tests__/redirectHelpers.test.js
```

## Benefits

1. **User Experience**: Users are automatically directed to their appropriate dashboard
2. **Security**: Role-based access ensures users only see relevant content
3. **Maintainability**: Centralized logic makes updates easy
4. **Performance**: Efficient redirects prevent unnecessary page loads
5. **Consistency**: Same redirect logic across all entry points

## Future Enhancements

1. **Dynamic Role Configuration**: Load role mappings from API
2. **Custom Redirect Rules**: Allow tenant-specific redirect overrides
3. **Analytics**: Track redirect patterns for optimization
4. **A/B Testing**: Test different redirect strategies
5. **Mobile Optimization**: Different redirects for mobile users

## Troubleshooting

### Common Issues
1. **Infinite Redirects**: Check for circular redirect dependencies
2. **Wrong Redirects**: Verify user role mapping and data
3. **Missing Redirects**: Ensure all roles are handled in the switch statement

### Debug Information
- All redirects include console logging for debugging
- Role and user data are logged before redirect decisions
- Path validation results are logged for troubleshooting

## Conclusion

This implementation provides a robust, scalable, and maintainable role-based redirect system that enhances user experience while maintaining security and performance. The centralized approach ensures consistency across the application and makes future enhancements straightforward.
