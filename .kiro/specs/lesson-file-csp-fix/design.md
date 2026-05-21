# Lesson File CSP Fix Bugfix Design

## Overview

The DataSeeder is using external URLs for lesson files that violate Content Security Policy (CSP) directives, causing PDF and video files to be blocked by browsers. The bug manifests when users attempt to access lesson files with URLs from domains that don't allow framing from the application's origin. The fix involves updating DataSeeder to use CSP-compliant URLs or local file references that don't trigger CSP violations.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when lesson file URLs violate CSP frame-ancestors directive
- **Property (P)**: The desired behavior when accessing lesson files - files should be accessible without CSP violations
- **Preservation**: Existing functionality for valid file URLs and file management that must remain unchanged
- **DataSeeder**: The class in `com.onlinelearning.backend.config.DataSeeder` that seeds initial data including lesson files
- **Lesson_file**: The entity in `com.onlinelearning.backend.course.entity.Lesson_file` that stores file metadata
- **CSP (Content Security Policy)**: A security standard that helps prevent cross-site scripting and other code injection attacks

## Bug Details

### Bug Condition

The bug manifests when DataSeeder creates lesson files with URLs from domains that don't allow framing from the application's origin. The browser blocks these requests due to CSP violations, specifically the `frame-ancestors` directive.

**Formal Specification:**
```
FUNCTION isBugCondition(fileUrl)
  INPUT: fileUrl of type String
  OUTPUT: boolean
  
  RETURN fileUrl CONTAINS "https://www.w3.org/" 
         OR fileUrl CONTAINS other_non_compliant_domain
         AND browserCSPBlocks(fileUrl)
END FUNCTION
```

### Examples

- **Example 1**: PDF file with URL `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`
  - Expected: PDF should be accessible and displayable
  - Actual: Browser blocks with CSP error: "Framing 'https://www.w3.org/' violates the following Content Security Policy directive: 'frame-ancestors 'self' https://cms.w3.org/ https://cms-dev.w3.org/'. The request has been blocked."

- **Example 2**: Video file with URL `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`
  - Expected: Video should play without issues
  - Actual: May be blocked depending on CSP configuration

- **Example 3**: DOCX file with URL `https://file-examples.com/storage/feaade38c1651bd01984236/2017/02/file-sample_100kB.docx`
  - Expected: Document should be downloadable
  - Actual: May be blocked if domain doesn't allow framing

- **Edge case**: Local file URL or compliant external URL
  - Expected: File should work correctly
  - Actual: Should continue to work as before

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Video streaming from compliant external sources (like Google Cloud Storage) must continue to work
- Existing file upload and storage mechanisms must remain functional
- File type detection and validation must continue to work correctly
- File metadata and relationships must be preserved

**Scope:**
All URLs that are already CSP-compliant should be completely unaffected by this fix. This includes:
- Local file URLs served from the application's own domain
- External URLs from domains that allow framing from the application's origin
- Video URLs from compliant sources like Google Cloud Storage
- Any file URLs that currently work without CSP violations

## Hypothesized Root Cause

Based on the bug description and code analysis, the most likely issues are:

1. **Non-compliant External Domains**: The DataSeeder is using URLs from domains (w3.org, file-examples.com) that have restrictive CSP policies that don't allow framing from external origins
   - w3.org specifically restricts framing to 'self', cms.w3.org, and cms-dev.w3.org
   - file-examples.com may have similar restrictions

2. **Lack of CSP Compliance Checking**: The DataSeeder doesn't validate URLs against CSP compliance before storing them
   - No validation of whether domains allow framing from the application
   - No fallback mechanism for non-compliant URLs

3. **Hardcoded External URLs**: URLs are hardcoded in the DataSeeder without consideration for CSP implications
   - PDF URL points to w3.org which has strict CSP
   - DOCX URL points to file-examples.com which may have CSP restrictions

4. **Missing Local File Alternatives**: No local placeholder files are provided as alternatives to external URLs
   - Should have local dummy files for seeding data
   - Should use relative URLs or local storage for development

## Correctness Properties

Property 1: Bug Condition - CSP Compliant File URLs

_For any_ lesson file URL created by DataSeeder, the fixed DataSeeder SHALL use URLs that comply with the application's Content Security Policy, ensuring files are accessible without CSP violations.

**Validates: Requirements 2.1, 2.1.1, 2.1.2, 2.1.3**

Property 2: Preservation - Valid File Functionality

_For any_ file URL that is already CSP-compliant (including video URLs from Google Cloud Storage), the fixed DataSeeder SHALL continue to use the same URLs, preserving all existing functionality for compliant file sources.

**Validates: Requirements 3.1, 3.1.1, 3.1.2, 3.2, 3.2.1, 3.2.2**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `l:\BTL_KTTKPM\course-service\src\main\java\com\onlinelearning\backend\config\DataSeeder.java`

**Function**: `run()` method and URL constants

**Specific Changes**:
1. **Replace Non-compliant PDF URL**: Change w3.org PDF URL to a CSP-compliant alternative
   - Option 1: Use a local placeholder PDF file in resources
   - Option 2: Use a public domain PDF from a CSP-compliant source
   - Option 3: Use a data URL for small PDF content

2. **Replace Non-compliant DOCX URL**: Change file-examples.com DOCX URL to a CSP-compliant alternative
   - Similar options as PDF: local file, compliant external source, or data URL

3. **Validate Video URL**: Verify that Google Cloud Storage video URL is CSP-compliant
   - Check if `https://commondatastorage.googleapis.com` allows framing
   - If not compliant, find alternative video source

4. **Add URL Validation Logic**: Implement basic CSP compliance checking
   - Maintain a whitelist of CSP-compliant domains
   - Validate URLs against whitelist before use
   - Log warnings for non-compliant URLs

5. **Create Local Placeholder Files**: Add dummy files to resources directory
   - Small PDF file for PDF placeholders
   - Small DOCX file for document placeholders
   - Reference these local files in DataSeeder

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that simulate browser CSP validation for the URLs used in DataSeeder. Run these tests on the UNFIXED code to observe failures and understand the root cause.

**Test Cases**:
1. **W3.org PDF URL Test**: Validate that w3.org PDF URL violates CSP (will fail on unfixed code)
2. **File-examples.com DOCX Test**: Validate that file-examples.com URL may violate CSP (will fail on unfixed code)
3. **Google Cloud Storage Video Test**: Validate that Google Cloud Storage URL is CSP-compliant (should pass)
4. **Local File URL Test**: Test that local file URLs are always CSP-compliant (should pass)

**Expected Counterexamples**:
- w3.org URL fails CSP validation due to restrictive frame-ancestors policy
- file-examples.com may fail depending on its CSP configuration
- Possible causes: hardcoded external URLs, lack of CSP compliance checking

### Fix Checking

**Goal**: Verify that for all URLs where the bug condition holds, the fixed DataSeeder produces CSP-compliant URLs.

**Pseudocode:**
```
FOR ALL fileUrl WHERE isBugCondition(fileUrl) DO
  newUrl := DataSeeder.getCompliantUrl(fileUrl)
  ASSERT isCspCompliant(newUrl)
END FOR
```

### Preservation Checking

**Goal**: Verify that for all URLs where the bug condition does NOT hold, the fixed DataSeeder produces the same URLs as the original DataSeeder.

**Pseudocode:**
```
FOR ALL fileUrl WHERE NOT isBugCondition(fileUrl) DO
  ASSERT DataSeeder_original.getUrl(fileType) = DataSeeder_fixed.getUrl(fileType)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across different file types and patterns
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for compliant URLs

**Test Plan**: Observe behavior on UNFIXED code first for compliant URLs, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Video URL Preservation**: Verify Google Cloud Storage video URLs continue to be used after fix
2. **File Type Pattern Preservation**: Verify the pattern of file types per lesson (mp4 only, mp4+pdf, etc.) continues unchanged
3. **File Metadata Preservation**: Verify file metadata (name, type, order) generation logic remains unchanged

### Unit Tests

- Test URL replacement logic for non-compliant domains
- Test CSP compliance validation function
- Test file URL generation patterns
- Test that local placeholder files exist and are accessible

### Property-Based Tests

- Generate random file types and verify CSP compliance of generated URLs
- Generate random lesson positions and verify correct file pattern application
- Test that all generated URLs are accessible (no 404s or CSP violations)

### Integration Tests

- Test full DataSeeder execution and verify no CSP-violating URLs in database
- Test file access through the application UI after seeding
- Test that video playback works correctly after fix
- Test that PDF and document downloads work without CSP errors