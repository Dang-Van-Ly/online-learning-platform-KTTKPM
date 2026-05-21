# Video Lesson Fix Bugfix Design

## Overview

This bugfix addresses the issue where video files in lessons fail to play, showing only a black screen when users click on them. The problem occurs because the current system lacks proper video metadata support, video streaming configuration, and frontend video playback handling. The fix involves adding video metadata to the Lesson_file entity, configuring API Gateway for video streaming, adding sample video links, and implementing video playback controllers/services.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when a user attempts to play a video file in a lesson
- **Property (P)**: The desired behavior when video playback is attempted - video should load and play with proper controls
- **Preservation**: Existing non-video file behavior (PDFs, documents, images) that must remain unchanged by the fix
- **Lesson_file**: The entity in `course-service/src/main/java/com/onlinelearning/backend/course/entity/Lesson_file.java` that represents files attached to lessons
- **VideoMetadata**: Additional properties needed for video files (duration, resolution, codec, thumbnail URL)
- **API Gateway**: The nginx configuration in `api-gateway/nginx.conf` that routes requests to services
- **VideoPlaybackService**: Service responsible for handling video streaming and playback requests

## Bug Details

### Bug Condition

The bug manifests when a user navigates to a lesson containing a video file, clicks on the video to play it, and instead of video playback, only a black screen is displayed. The system is either not correctly identifying video files, not providing proper video metadata, not configuring streaming headers, or not handling video playback requests correctly.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type VideoPlaybackRequest
  OUTPUT: boolean
  
  RETURN input.fileType IN ['video/mp4', 'video/webm', 'video/ogg']
         AND input.userAction = 'play'
         AND NOT videoLoadsSuccessfully(input.fileUrl)
         AND NOT videoPlaysWithControls(input.fileUrl)
END FUNCTION
```

### Examples

- **Example 1**: User clicks on "BigBuckBunny.mp4" video in lesson - expected: video plays with controls; actual: black screen
- **Example 2**: User clicks on "ElephantsDream.mp4" video - expected: video loads and plays; actual: nothing happens, black screen
- **Example 3**: User clicks on "Sintel.mp4" video - expected: video streams with seek functionality; actual: black screen, no controls
- **Edge Case**: User clicks on PDF file - expected: PDF opens/downloads; actual: PDF works correctly (should remain unchanged)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- PDF files must continue to open/download correctly when clicked
- Image files must continue to display properly when viewed
- Document files (DOC, PPT, etc.) must continue to work as before
- Non-video file uploads and management must remain unchanged
- Lesson navigation and structure must remain unaffected

**Scope:**
All inputs that do NOT involve video file playback should be completely unaffected by this fix. This includes:
- PDF file downloads/views
- Image file displays
- Document file handling
- Text file views
- Audio file playback (if supported)

## Hypothesized Root Cause

Based on the bug description and code analysis, the most likely issues are:

1. **Missing Video Metadata**: The Lesson_file entity lacks video-specific metadata fields (duration, resolution, codec, thumbnail URL)
   - Current entity only has basic file properties
   - No way to distinguish video files or provide video-specific information

2. **Incorrect API Gateway Configuration**: The nginx.conf lacks proper video streaming headers and configurations
   - Missing `Content-Range` header support for byte-range requests
   - Missing proper MIME type handling for video files
   - Missing streaming optimization configurations

3. **Missing Video Playback Endpoints**: No dedicated controller/service for video streaming and playback
   - No endpoint for video metadata retrieval
   - No streaming endpoint with proper headers
   - No sample video data for testing

4. **Frontend Video Handling Issues**: Frontend may not be receiving proper video metadata or URLs
   - Video player may not be getting correct source URLs
   - Missing video metadata for player configuration
   - Incorrect CORS or header handling

5. **Sample Video Integration**: No sample videos provided for testing and demonstration
   - Need sample video URLs for testing
   - Need to ensure external video URLs work with the system

## Correctness Properties

Property 1: Bug Condition - Video Playback Functionality

_For any_ video file input where the bug condition holds (isBugCondition returns true), the fixed system SHALL successfully load and play the video with proper controls, displaying video content instead of a black screen, and supporting seek/play/pause functionality.

**Validates: Requirements 1.1, 1.2, 1.3**

Property 2: Preservation - Non-Video File Behavior

_For any_ input that is NOT a video file (PDFs, images, documents, text files), the fixed system SHALL produce exactly the same behavior as the original system, preserving all existing functionality for non-video file types and maintaining backward compatibility.

**Validates: Requirements 2.1, 2.2, 2.3**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File 1**: `course-service/src/main/java/com/onlinelearning/backend/course/entity/Lesson_file.java`

**Specific Changes**:
1. **Add Video Metadata Fields**: Add new fields for video duration, resolution, codec, and thumbnail URL
   - Add `durationSeconds: Integer` field for video length
   - Add `resolution: String` field (e.g., "1920x1080")
   - Add `videoCodec: String` field (e.g., "h264", "vp9")
   - Add `thumbnailUrl: String` field for video preview image
   - Add `isVideo: Boolean` field to easily identify video files

2. **Update Database Schema**: Ensure new fields are properly mapped to database columns
   - Add `@Column` annotations for new fields
   - Consider nullable fields for non-video files

**File 2**: `api-gateway/nginx.conf`

**Specific Changes**:
1. **Add Video Streaming Configuration**: Add proper headers for video streaming
   - Add `proxy_set_header Accept-Ranges bytes;` for byte-range support
   - Add `proxy_set_header Content-Range $content_range;` for partial content
   - Configure proper buffer sizes for video streaming
   - Add video-specific MIME type handling

2. **Add Video Sample Route**: Add direct route for sample video URLs
   - Create location block for sample video access
   - Ensure CORS headers for video streaming

**File 3**: Create new video controller/service in course-service

**Specific Changes**:
1. **Create VideoController**: Add endpoints for video metadata and streaming
   - `GET /api/videos/{id}/metadata` - Get video metadata
   - `GET /api/videos/{id}/stream` - Stream video with proper headers
   - `GET /api/videos/samples` - Get sample video URLs

2. **Create VideoService**: Business logic for video handling
   - Extract video metadata from files
   - Generate thumbnail URLs
   - Handle video streaming logic

3. **Add Sample Video Data**: Add 3 sample video links to database/seeder
   - BigBuckBunny.mp4
   - ElephantsDream.mp4  
   - Sintel.mp4

**File 4**: Frontend video player component (if applicable)

**Specific Changes**:
1. **Update Video Player**: Ensure video player uses correct endpoints
   - Use streaming endpoint for video source
   - Fetch metadata for player configuration
   - Handle video errors gracefully

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that attempt to play video files and assert that video loads and plays correctly. Run these tests on the UNFIXED code to observe failures and understand the root cause.

**Test Cases**:
1. **Video Playback Test**: Attempt to play a video file (will fail on unfixed code)
2. **Video Metadata Test**: Attempt to retrieve video metadata (will fail on unfixed code)
3. **Sample Video Test**: Attempt to access sample video URLs (may fail on unfixed code)
4. **Streaming Test**: Attempt to stream video with byte-range requests (will fail on unfixed code)

**Expected Counterexamples**:
- Video playback results in black screen or error
- Video metadata endpoints return 404 or incorrect data
- Sample video URLs are not accessible
- Streaming requests fail without proper headers

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := handleVideoPlayback_fixed(input)
  ASSERT videoPlaysSuccessfully(result)
  ASSERT hasVideoControls(result)
  ASSERT displaysVideoContent(result)
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT handleFileAccess_original(input) = handleFileAccess_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for non-video files, then write property-based tests capturing that behavior.

**Test Cases**:
1. **PDF Preservation Test**: Verify PDF files continue to work correctly
2. **Image Preservation Test**: Verify image files display properly
3. **Document Preservation Test**: Verify document files work as before
4. **File Upload Preservation Test**: Verify file upload functionality remains unchanged

### Unit Tests

- Test video metadata extraction and storage
- Test video streaming endpoint with proper headers
- Test sample video URL integration
- Test non-video file behavior preservation
- Test API Gateway video streaming configuration

### Property-Based Tests

- Generate random file types and verify video/non-video handling
- Generate random video metadata and verify proper storage/retrieval
- Test video streaming across various byte ranges and file sizes
- Verify preservation of non-video file behavior across many scenarios

### Integration Tests

- Test full video playback flow from lesson access to video playing
- Test sample video integration and accessibility
- Test video streaming with seek functionality
- Test that non-video files continue to work in lesson context
- Test API Gateway video streaming configuration with actual requests