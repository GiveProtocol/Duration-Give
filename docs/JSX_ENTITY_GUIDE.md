# JSX Entity Escaping Guide

## Quick Reference

Always escape these characters in JSX text content:

| Character | Escape Code | Example |
|-----------|-------------|---------|
| `'` (apostrophe) | `&apos;` | `don&apos;t` |
| `"` (quote) | `&quot;` | `&quot;hello&quot;` |
| `>` (greater than) | `&gt;` | `5 &gt; 3` |
| `}` (closing brace) | `&#125;` | `object&#125;` |

## ✅ Correct Examples

```tsx
// Apostrophes
<p>You don&apos;t have any messages</p>
<h2>Children&apos;s Privacy</h2>

// Quotes in text
<p>She said &quot;Hello world&quot;</p>
<p>GiveProtocol (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)</p>

// Greater than symbols
<p>Donations &gt; $100 get special recognition</p>

// Closing braces in text
<p>Use this syntax: &#125;</p>
```

## ❌ Incorrect Examples

```tsx
// Will cause DeepSource JS-0454 errors
<p>You don't have any messages</p>
<h2>Children's Privacy</h2>
<p>She said "Hello world"</p>
<p>Donations > $100 get special recognition</p>
```

## Alternative: Template Literals

For complex text with many special characters:

```tsx
<p>{'You don\'t need to escape inside template literals'}</p>
<p>{`She said "Hello" and it's working > perfectly`}</p>
```

## IDE Setup

### VS Code Extensions:
- **ESLint** - Catches unescaped entities in real-time
- **Prettier** - Formats code consistently
- **Auto Rename Tag** - Helps prevent malformed JSX

### Auto-fix on Save:
Our `.vscode/settings.json` automatically fixes these issues when you save.

## Prevention Tools

1. **ESLint Rule**: `react/no-unescaped-entities` (already configured)
2. **Pre-commit Hook**: Prevents commits with unescaped entities
3. **Lint-staged**: Runs ESLint on staged files before commit

## Common Scenarios

### Legal/Privacy Text
```tsx
// Common in legal documents
<p>We (&quot;Company&quot;) don&apos;t share your data</p>
```

### User Messages
```tsx
// Empty states and notifications
<p>You don&apos;t have any active subscriptions</p>
<p>Settings couldn&apos;t be saved</p>
```

### Technical Documentation
```tsx
// API docs or technical content
<code>Use &#125; to close objects</code>
<p>Response time &gt; 200ms indicates issues</p>
```

## Testing Your Changes

Run these commands to check for issues:

```bash
# Check for ESLint errors
npm run lint

# Fix automatically where possible  
npm run lint -- --fix

# Check specific file
npx eslint src/pages/YourFile.tsx
```

## Questions?

If you're unsure about escaping, check:
1. Run ESLint - it will catch most issues
2. Look at existing files for examples
3. Use template literals `{`content`}` for complex text
4. Ask in code review if you're uncertain

Remember: Better to over-escape than under-escape!