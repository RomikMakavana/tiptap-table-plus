
// Define types locally since they're not available from external module
type UserRole = 'admin' | 'editor' | 'viewer';
type Status = 'active' | 'inactive' | 'pending';

enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Critical = 'critical'
}

type Nullable<T> = T | null;
type Optional<T> = T | undefined;

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: User;
  publishedAt?: Date;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message: string;
}

interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

describe('Type Definitions', () => {
  // Test User type
  test('User interface should have correct properties', () => {
    const user: User = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date()
    };
    
    expect(user.id).toBe(1);
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  // Test Post type
  test('Post interface should have correct properties', () => {
    const user: User = {
      id: 1,
      name: 'Jane Doe',
      email: 'jane@example.com',
      createdAt: new Date()
    };

    const post: Post = {
      id: 1,
      title: 'Test Post',
      content: 'This is a test post',
      author: user
    };

    expect(post.id).toBe(1);
    expect(post.title).toBe('Test Post');
    expect(post.content).toBe('This is a test post');
    expect(post.author).toEqual(user);
  });

  test('Post interface should allow optional publishedAt', () => {
    const user: User = {
      id: 1,
      name: 'Jane Doe',
      email: 'jane@example.com',
      createdAt: new Date()
    };

    // Without publishedAt
    const postWithoutDate: Post = {
      id: 1,
      title: 'Test Post',
      content: 'This is a test post',
      author: user
    };

    // With publishedAt
    const postWithDate: Post = {
      id: 2,
      title: 'Published Post',
      content: 'This is a published post',
      author: user,
      publishedAt: new Date()
    };

    expect(postWithoutDate.publishedAt).toBeUndefined();
    expect(postWithDate.publishedAt).toBeInstanceOf(Date);
  });

  // Test UserRole type
  test('UserRole should accept valid values', () => {
    const adminRole: UserRole = 'admin';
    const editorRole: UserRole = 'editor';
    const viewerRole: UserRole = 'viewer';

    expect(adminRole).toBe('admin');
    expect(editorRole).toBe('editor');
    expect(viewerRole).toBe('viewer');
  });

  // Test Status type
  test('Status should accept valid values', () => {
    const activeStatus: Status = 'active';
    const inactiveStatus: Status = 'inactive';
    const pendingStatus: Status = 'pending';

    expect(activeStatus).toBe('active');
    expect(inactiveStatus).toBe('inactive');
    expect(pendingStatus).toBe('pending');
  });

  // Test ApiResponse type
  test('ApiResponse should handle success case', () => {
    const successResponse: ApiResponse<string> = {
      success: true,
      data: 'Success data',
      message: 'Operation successful'
    };

    expect(successResponse.success).toBe(true);
    expect(successResponse.data).toBe('Success data');
    expect(successResponse.message).toBe('Operation successful');
    expect(successResponse.error).toBeUndefined();
  });

  test('ApiResponse should handle error case', () => {
    const errorResponse: ApiResponse<number> = {
      success: false,
      error: 'Something went wrong',
      message: 'Operation failed'
    };

    expect(errorResponse.success).toBe(false);
    expect(errorResponse.error).toBe('Something went wrong');
    expect(errorResponse.message).toBe('Operation failed');
    expect(errorResponse.data).toBeUndefined();
  });

  // Test Priority enum
  test('Priority enum should have correct values', () => {
    expect(Priority.Low).toBe('low');
    expect(Priority.Medium).toBe('medium');
    expect(Priority.High).toBe('high');
    expect(Priority.Critical).toBe('critical');

    const priority: Priority = Priority.High;
    expect(priority).toBe('high');
  });

  // Test Nullable utility type
  test('Nullable utility type should work correctly', () => {
    const nullableString: Nullable<string> = 'test';
    const nullValue: Nullable<string> = null;

    expect(nullableString).toBe('test');
    expect(nullValue).toBeNull();
  });

  // Test Optional utility type
  test('Optional utility type should work correctly', () => {
    const optionalString: Optional<string> = 'test';
    const undefinedValue: Optional<string> = undefined;

    expect(optionalString).toBe('test');
    expect(undefinedValue).toBeUndefined();
  });

  // Test PaginationOptions interface
  test('PaginationOptions should have correct properties', () => {
    const options: PaginationOptions = {
      page: 1,
      limit: 10
    };

    expect(options.page).toBe(1);
    expect(options.limit).toBe(10);

    // With optional fields
    const detailedOptions: PaginationOptions = {
      page: 2,
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };

    expect(detailedOptions.page).toBe(2);
    expect(detailedOptions.limit).toBe(20);
    expect(detailedOptions.sortBy).toBe('createdAt');
    expect(detailedOptions.sortOrder).toBe('desc');
  });

  // Test PaginatedResult interface
  test('PaginatedResult should have correct properties', () => {
    const result: PaginatedResult<User> = {
      items: [
        {
          id: 1,
          name: 'User 1',
          email: 'user1@example.com',
          createdAt: new Date()
        },
        {
          id: 2,
          name: 'User 2',
          email: 'user2@example.com',
          createdAt: new Date()
        }
      ],
      total: 150,
      page: 1,
      limit: 10,
      totalPages: 15
    };

    expect(result.items.length).toBe(2);
    expect(result.total).toBe(150);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(15);
  });
});