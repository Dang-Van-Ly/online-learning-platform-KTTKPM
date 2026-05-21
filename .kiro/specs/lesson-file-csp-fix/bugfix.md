# Bugfix Requirements Document

## Introduction

The DataSeeder is using external URLs for lesson files that are being blocked by Content Security Policy (CSP). Users cannot open these files because the browser blocks them due to CSP violations. The error message shows: "Framing 'https://www.w3.org/' violates the following Content Security Policy directive: 'frame-ancestors 'self' https://cms.w3.org/ https://cms-dev.w3.org/'. The request has been blocked."

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN DataSeeder creates lesson files with external URLs (https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf) THEN the system stores these URLs in the database
1.2 WHEN users attempt to access lesson files with external URLs THEN the browser blocks the request due to CSP violations
1.3 WHEN the application tries to display or download files from external domains THEN the system fails with CSP errors preventing file access

### Expected Behavior (Correct)

2.1 WHEN DataSeeder creates lesson files THEN the system SHALL use local or whitelisted file URLs that comply with CSP
2.1.1 THE system SHALL define CSP-compliant URLs as those from domains that allow framing from the application's origin
2.1.2 THE system SHALL validate URLs against a whitelist of CSP-compliant domains before storing them
2.1.3 THE system SHALL replace non-compliant URLs with local placeholder files or compliant alternatives

2.2 WHEN users attempt to access lesson files THEN the system SHALL allow file access without CSP violations
2.2.1 THE system SHALL serve files from CSP-compliant domains or local storage
2.2.2 THE system SHALL provide appropriate CSP headers for locally served files
2.2.3 THE system SHALL handle CSP violations gracefully with user-friendly error messages

2.3 WHEN the application displays or downloads files THEN the system SHALL successfully retrieve and serve the files
2.3.1 THE system SHALL verify file accessibility before attempting to serve them
2.3.2 THE system SHALL implement fallback mechanisms for inaccessible external files
2.3.3 THE system SHALL log CSP violations for monitoring and debugging

### Unchanged Behavior (Regression Prevention)

3.1 WHEN DataSeeder creates video files with external URLs (https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4) THEN the system SHALL CONTINUE TO store and serve these URLs if they comply with CSP
3.1.1 THE system SHALL CONTINUE TO support video streaming from compliant external sources
3.1.2 THE system SHALL CONTINUE TO validate video URLs against the same CSP compliance rules

3.2 WHEN lesson files are created with valid, accessible URLs THEN the system SHALL CONTINUE TO store and serve them correctly
3.2.1 THE system SHALL CONTINUE TO support existing file upload and storage mechanisms
3.2.2 THE system SHALL CONTINUE TO maintain file metadata and relationships

3.3 WHEN the application handles file uploads and storage THEN the system SHALL CONTINUE TO maintain existing file management functionality
3.3.1 THE system SHALL CONTINUE TO support file type detection and validation
3.3.2 THE system SHALL CONTINUE TO maintain file access controls and permissions