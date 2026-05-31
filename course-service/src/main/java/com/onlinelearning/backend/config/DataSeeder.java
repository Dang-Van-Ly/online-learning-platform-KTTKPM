package com.onlinelearning.backend.config;

import com.onlinelearning.backend.course.entity.*;
import com.onlinelearning.backend.course.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CourseRepository courseRepository;
    private final ChapterRepository chapterRepository;
    private final LessonRepository lessonRepository;
    private final Lesson_fileRepository lessonFileRepository;

    public DataSeeder(CourseRepository courseRepository,
                      ChapterRepository chapterRepository,
                      LessonRepository lessonRepository,
                      Lesson_fileRepository lessonFileRepository) {
        this.courseRepository = courseRepository;
        this.chapterRepository = chapterRepository;
        this.lessonRepository = lessonRepository;
        this.lessonFileRepository = lessonFileRepository;
    }

    private static final Object[][] COURSES = {
        {"Lap trinh ReactJS tu Zero den Hero", "Khoa hoc ReactJS toan dien nhat danh cho nguoi moi bat dau. Ban se hoc tu co ban den nang cao: JSX, Component, State, Props, Hooks, Redux, React Router va xay dung du an thuc te.", 799000.0, "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop", "Lap trinh - Web", "instructer", "PAID"},
        {"Khoa hoc Python cho Data Science", "Hoc Python ung dung trong phan tich du lieu voi NumPy, Pandas, Matplotlib, Seaborn va Scikit-learn. Phu hop cho nguoi muon chuyen nganh sang Data Science.", 699000.0, "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop", "Data Analysis", "instructer", "PAID"},
        {"ChatGPT & AI cho nguoi di lam", "Tan dung suc manh cua ChatGPT va cac cong cu AI de tang nang suat lam viec gap 3 lan. Hoc cach viet prompt hieu qua, tu dong hoa cong viec va ung dung AI vao thuc te.", 499000.0, "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=300&fit=crop", "AI - ChatGPT", "instructer", "PAID"},
        {"SEO Tong the tu A den Z", "Nam vung toan bo kien thuc SEO: nghien cuu tu khoa, toi uu On-page, xay dung backlink, SEO ky thuat va do luong hieu qua.", 599000.0, "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=300&fit=crop", "SEO", "instructer", "PAID"},
        {"Thiet ke UI/UX voi Figma", "Hoc thiet ke giao dien nguoi dung chuyen nghiep voi Figma. Tu wireframe, prototype den design system. Bao gom 5 du an thuc te.", 649000.0, "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop", "Do hoa - Thiet ke", "instructer", "PAID"},
        {"Tieng Anh giao tiep cho nguoi di lam", "Nang cao ky nang tieng Anh giao tiep trong moi truong cong so: email, hop hanh, thuyet trinh va dam phan.", 0.0, "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop", "Tieng Anh", "instructer", "FREE"},
        {"Facebook Ads - Chay quang cao hieu qua", "Hoc cach tao va toi uu chien dich quang cao Facebook tu co ban den nang cao.", 749000.0, "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop", "Ads", "instructer", "PAID"},
        {"Dau tu chung khoan cho nguoi moi", "Huong dan dau tu chung khoan tu dau: phan tich co ban, phan tich ky thuat, quan ly danh muc va tam ly dau tu.", 899000.0, "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop", "Crypto - Forex - Chung khoan", "instructer", "PAID"},
        {"Kinh doanh Shopee tu 0 dong", "Xay dung gian hang Shopee tu dau: chon san pham, toi uu listing, chay Flash Sale, quan ly don hang va scale up doanh thu.", 549000.0, "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop", "Shopee", "instructer", "PAID"},
        {"Ke toan thuc hanh tren Excel", "Hoc ke toan thuc te voi Excel: lap bang can doi ke toan, bao cao ket qua kinh doanh, quan ly dong tien.", 0.0, "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop", "Tai Chinh - Ke Toan", "instructer", "FREE"},
        {"Node.js & Express - Backend Development", "Xay dung REST API chuyen nghiep voi Node.js va Express. Hoc authentication, database integration voi MongoDB.", 799000.0, "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop", "Lap trinh - Web", "instructer", "PAID"},
        {"TikTok Marketing - Viral Content Strategy", "Chien luoc xay dung kenh TikTok tu 0 den 100K followers. Hoc cach tao noi dung viral, TikTok Ads va kiem tien.", 449000.0, "https://images.unsplash.com/photo-1611605698335-8441fbfd049b?w=400&h=300&fit=crop", "Tiktok", "instructer", "PAID"},
        {"Copywriting - Viet content ban hang", "Hoc nghe thuat viet content thuyet phuc: headline, storytelling, call-to-action va cac framework copywriting noi tieng.", 599000.0, "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop", "Copywriting", "instructer", "PAID"},
        {"Dau tu Bat dong san thuc chien", "Huong dan dau tu bat dong san: phan tich thi truong, dinh gia tai san, phap ly, dam phan va quan ly danh muc BDS.", 1299000.0, "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop", "Bat dong san", "instructer", "PAID"},
        {"Tin hoc van phong nang cao", "Thanh thao Word, Excel, PowerPoint o muc chuyen nghiep. Hoc cac tinh nang nang cao, macro, VBA co ban.", 0.0, "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop", "Tin hoc van phong", "instructer", "FREE"},
        {"Kiem tien online voi Affiliate Marketing", "Xay dung he thong thu nhap thu dong voi Affiliate Marketing: chon niche, xay dung website, SEO, email marketing.", 699000.0, "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=300&fit=crop", "Kiem tien online", "instructer", "PAID"},
        {"Edit Video chuyen nghiep voi Premiere Pro", "Hoc dung phim chuyen nghiep voi Adobe Premiere Pro: cat ghep, color grading, motion graphics, am thanh.", 749000.0, "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop", "Edit Video", "instructer", "PAID"},
        {"Tieng Trung giao tiep co ban", "Hoc tieng Trung tu dau voi phuong phap nghe - noi - doc - viet. Nam vung 1000 tu vung thong dung.", 499000.0, "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=400&h=300&fit=crop", "Tieng Trung - Nhat - Han", "instructer", "PAID"},
        {"Marketing tong the cho doanh nghiep", "Xay dung chien luoc marketing toan dien: brand identity, content marketing, social media, email marketing.", 999000.0, "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400&h=300&fit=crop", "Kinh doanh - Marketing", "instructer", "PAID"},
        {"Phong thuy nha o va van phong", "Ung dung phong thuy vao thiet ke nha o va van phong: bo cuc khong gian, mau sac, huong nha.", 0.0, "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", "Phong Thuy", "instructer", "FREE"},
        {"Vue.js 3 - Framework JavaScript hien dai", "Hoc Vue.js 3 tu co ban den nang cao: Composition API, Vue Router, Pinia va xay dung ung dung SPA hoan chinh.", 749000.0, "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop", "Lap trinh - Web", "instructer", "PAID"},
        {"Google Ads - Tim kiem & Display", "Tao va toi uu chien dich Google Ads hieu qua: Search Ads, Display Ads, Shopping Ads, YouTube Ads va remarketing.", 849000.0, "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=400&h=300&fit=crop", "Ads", "instructer", "PAID"},
        {"Machine Learning voi Python", "Hoc Machine Learning thuc te: regression, classification, clustering, neural networks va deep learning.", 999000.0, "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=300&fit=crop", "Data Analysis", "instructer", "PAID"},
        {"Tieng Nhat N5 - N4 cho nguoi moi", "Hoc tieng Nhat tu dau den trinh do N4: Hiragana, Katakana, Kanji co ban, ngu phap va hoi thoai thuc te.", 599000.0, "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=300&fit=crop", "Tieng Trung - Nhat - Han", "instructer", "PAID"},
        {"Xay dung thuong hieu ca nhan", "Hoc cach xay dung personal brand manh me: dinh vi ban than, tao noi dung chuyen mon, networking.", 0.0, "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=400&h=300&fit=crop", "Kinh doanh - Marketing", "instructer", "FREE"},
        {"Crypto & Blockchain co ban", "Hieu ro ve Blockchain, Bitcoin, Ethereum va DeFi. Hoc cach dau tu crypto an toan, phan tich on-chain.", 799000.0, "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop", "Crypto - Forex - Chung khoan", "instructer", "PAID"},
        {"Thiet ke do hoa voi Photoshop", "Thanh thao Adobe Photoshop tu co ban den nang cao: chinh sua anh, thiet ke banner, poster, social media.", 649000.0, "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400&h=300&fit=crop", "Do hoa - Thiet ke", "instructer", "PAID"},
        {"Email Marketing tu dong hoa", "Xay dung he thong email marketing tu dong: list building, segmentation, automation workflow, A/B testing.", 549000.0, "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=300&fit=crop", "Kinh doanh - Marketing", "instructer", "PAID"},
        {"Lap trinh Java Spring Boot", "Xay dung ung dung enterprise voi Spring Boot: REST API, Spring Security, JPA/Hibernate, microservices va Docker.", 899000.0, "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop", "Lap trinh - Web", "instructer", "PAID"},
        {"Yoga & Thien dinh cho nguoi ban ron", "Hoc yoga va thien dinh phu hop voi lich trinh ban ron: cac bai tap 15-30 phut, ky thuat tho, mindfulness.", 0.0, "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop", "Phong the", "instructer", "FREE"}
    };
    // Lessons per chapter - realistic titles matching chapter topics
    private static final String[][][] LESSONS = {
        // Course 0: ReactJS
        {{"Gioi thieu khoa hoc & Cai dat Node.js, VS Code","Tong quan ve React va tai sao nen hoc","Cai dat Create React App va cau truc du an"},
         {"let, const, arrow function, destructuring","Template literals, spread operator, modules","Async/Await va Promise trong JavaScript"},
         {"JSX la gi va cach viet JSX","Tao Component dau tien","Props va truyen du lieu giua Component"},
         {"useState Hook co ban","useEffect va vong doi Component","Xu ly su kien va form trong React"},
         {"useContext, useRef, useMemo","Custom Hooks - tao Hook rieng","useReducer va quan ly state phuc tap"},
         {"Redux Toolkit - cai dat va cau hinh","Actions, Reducers va Store","React-Redux: connect component voi store"},
         {"Xay dung trang Home va danh sach san pham","Gio hang va thanh toan","Deploy len Vercel va tong ket"}},
        // Course 1: Python Data Science
        {{"Cai dat Python, Anaconda va Jupyter Notebook","Kieu du lieu, bien va toan tu trong Python","Vong lap, dieu kien va ham trong Python"},
         {"Tao va thao tac mang voi NumPy","Indexing, slicing va broadcasting","Tinh toan thong ke voi NumPy"},
         {"Tao DataFrame tu CSV, Excel, JSON","Loc, sap xep va nhom du lieu","Xu ly gia tri null va lam sach du lieu"},
         {"Ve bieu do duong, cot, tron voi Matplotlib","Seaborn: heatmap, boxplot, pairplot","Tuy chinh bieu do chuyen nghiep"},
         {"Linear Regression va Logistic Regression","Decision Tree va Random Forest","Danh gia mo hinh: accuracy, precision, recall"},
         {"Phan tich du lieu ban hang thuc te","Xay dung dashboard bao cao","Trinh bay ket qua va ket luan"}},
        // Course 2: ChatGPT AI
        {{"AI la gi? Lich su phat trien AI","ChatGPT va cac mo hinh ngon ngu lon","Dang ky va lam quen voi ChatGPT"},
         {"Prompt la gi? Cac loai prompt co ban","Ky thuat Chain-of-Thought prompting","Few-shot va zero-shot prompting"},
         {"Viet email chuyen nghiep voi ChatGPT","Tao bao cao va tai lieu nhanh chong","Phan tich du lieu bang ChatGPT"},
         {"Tao noi dung marketing voi AI","Viet quang cao va caption mang xa hoi","SEO content voi su ho tro cua AI"},
         {"Zapier + ChatGPT: tu dong hoa email","Make.com: xay dung workflow tu dong","Tich hop AI vao Google Sheets"},
         {"Xay dung quy trinh lam viec ca nhan","Tao template prompt cho cong viec hang ngay","Tong ket va huong phat trien tiep theo"}},
        // Course 3: SEO
        {{"SEO la gi? Cach Google xep hang website","Cac yeu to anh huong den thu hang","Cai dat Google Search Console va Analytics"},
         {"Nghien cuu tu khoa voi Google Keyword Planner","Ahrefs va SEMrush: phan tich tu khoa","Phan tich tu khoa doi thu canh tranh"},
         {"Toi uu the title, meta description","Cau truc heading H1-H6 chuan SEO","Toi uu hinh anh: alt text, ten file, nen anh"},
         {"Backlink la gi? Tai sao quan trong","Guest post va xay dung lien ket chat luong","Phan tich profile backlink doi thu"},
         {"Core Web Vitals: LCP, FID, CLS","Toc do tai trang va cach cai thien","Schema markup va du lieu co cau truc"},
         {"Thiet lap bao cao SEO hang thang","Theo doi thu hang tu khoa","Phan tich va dieu chinh chien luoc"}},
        // Course 4: Figma UI/UX
        {{"Cai dat Figma va lam quen giao dien","Cac cong cu co ban: frame, shape, text","Auto Layout va Constraints"},
         {"8 nguyen tac thiet ke UX co ban","User Research va Persona","User Journey Map va Information Architecture"},
         {"Tao Wireframe lo-fi nhanh chong","Prototype tuong tac co ban","Usability Testing voi nguoi dung that"},
         {"Tao Component va Variant","Xay dung Color System va Typography","Icons, Spacing va Grid System"},
         {"Thiet ke man hinh Home, Onboarding","Thiet ke man hinh danh sach va chi tiet","Thiet ke man hinh Profile va Setting"},
         {"Thiet ke trang Landing Page","Thiet ke trang Blog va Portfolio","Handoff cho developer voi Inspect"}}
    };

    @Override
    public void run(String... args) {
        if (courseRepository.count() > 0) {
            System.out.println("Data already exists, skipping seed.");
            return;
        }

        System.out.println("Start seeding 30 courses with lessons and files...");

        String[][][] chapterData = {
            {{"Gioi thieu & Cai dat moi truong","JavaScript ES6+ can biet","React Co ban: JSX & Component","State, Props & Event Handling","React Hooks chuyen sau","Redux & State Management","Du an thuc te: Xay dung E-commerce"}},
            {{"Gioi thieu Python & Cai dat","Cau truc du lieu voi NumPy","Phan tich du lieu voi Pandas","Truc quan hoa voi Matplotlib & Seaborn","Machine Learning co ban voi Scikit-learn","Du an: Phan tich du lieu thuc te"}},
            {{"Tong quan ve AI & ChatGPT","Ky thuat viet Prompt hieu qua","ChatGPT cho cong viec van phong","AI Tools cho Marketing & Content","Tu dong hoa quy trinh voi AI","Xay dung workflow AI ca nhan"}},
            {{"Nen tang SEO & Thuat toan Google","Nghien cuu tu khoa chuyen sau","Toi uu On-page SEO","Xay dung Backlink chat luong","SEO ky thuat & Core Web Vitals","Do luong & Bao cao SEO"}},
            {{"Gioi thieu Figma & UI Design","Nguyen tac thiet ke UX","Wireframing & Prototyping","Design System & Component Library","Du an 1: Thiet ke App Mobile","Du an 2: Thiet ke Website"}},
            {{"Phat am & Ngu dieu tieng Anh","Tieng Anh trong email cong viec","Giao tiep trong cuoc hop","Thuyet trinh bang tieng Anh","Dam phan & Thuong luong"}},
            {{"Tong quan Facebook Ads","Cai dat Business Manager & Pixel","Tao chien dich & Target Audience","Toi uu quang cao & A/B Testing","Retargeting & Lookalike Audience","Bao cao & Phan tich hieu qua"}},
            {{"Kien thuc nen tang dau tu","Phan tich co ban doanh nghiep","Phan tich ky thuat & Bieu do","Quan ly danh muc & Rui ro","Tam ly dau tu & Ky luat","Chien luoc dau tu dai han"}},
            {{"Tong quan kinh doanh Shopee","Nghien cuu san pham & Doi thu","Toi uu listing & Hinh anh san pham","Chien luoc gia & Khuyen mai","Quang cao Shopee Ads","Scale up & Quan ly van hanh"}},
            {{"Tong quan ke toan doanh nghiep","Excel nang cao cho ke toan","Lap bao cao tai chinh","Quan ly dong tien & Ngan sach","Ke toan thue co ban"}},
            {{"Node.js Fundamentals","Express.js & REST API","Authentication & Authorization","Database voi MongoDB & Mongoose","Testing & Error Handling","Deployment & DevOps co ban"}},
            {{"Hieu thuat toan TikTok","Nghien cuu noi dung & Trend","Ky thuat quay & Dung video TikTok","Xay dung cong dong & Tuong tac","TikTok Ads & Kiem tien"}},
            {{"Tam ly hoc trong copywriting","Cac framework copywriting kinh dien","Viet headline & Hook thu hut","Storytelling trong ban hang","Copywriting cho tung kenh","Toi uu & Do luong hieu qua"}},
            {{"Tong quan thi truong BDS Viet Nam","Phan tich & Dinh gia BDS","Phap ly & Thu tuc mua ban","Ky nang dam phan BDS","Dau tu cho thue & Flip BDS","Quan ly danh muc BDS"}},
            {{"Word nang cao & Tu dong hoa","Excel: Ham & Cong thuc nang cao","Excel: Pivot Table & Dashboard","PowerPoint: Thiet ke chuyen nghiep","Macro & VBA co ban"}},
            {{"Tong quan Affiliate Marketing","Chon niche & San pham affiliate","Xay dung website & Blog","SEO cho Affiliate","Email Marketing & Funnel","Toi uu chuyen doi & Scale up"}},
            {{"Giao dien Premiere Pro & Workflow","Ky thuat cat ghep co ban","Color Grading chuyen nghiep","Motion Graphics & Titles","Xu ly am thanh","Xuat video & Toi uu cho cac nen tang"}},
            {{"Bang chu cai & Phat am tieng Trung","Tu vung & Ngu phap co ban","Hoi thoai hang ngay","Doc & Viet Han tu co ban","Luyen nghe & Noi thuc te"}},
            {{"Xay dung chien luoc Marketing","Brand Identity & Positioning","Content Marketing & SEO","Social Media Marketing","Paid Advertising","Do luong & Toi uu ROI"}},
            {{"Nguyen ly phong thuy co ban","Phong thuy phong khach & Bep","Phong thuy phong ngu & Phong lam viec","Mau sac & Vat pham phong thuy","Phong thuy van phong & Kinh doanh"}},
            {{"Vue.js 3 Fundamentals","Composition API chuyen sau","Vue Router & Navigation","Pinia State Management","Testing Vue Components","Du an thuc te: Xay dung SPA"}},
            {{"Tong quan Google Ads","Search Ads: Tu khoa & Quang cao","Display Ads & Remarketing","Shopping Ads cho E-commerce","YouTube Ads","Toi uu & Bao cao hieu qua"}},
            {{"Toan hoc cho Machine Learning","Supervised Learning","Unsupervised Learning","Neural Networks & Deep Learning","Computer Vision co ban","Du an ML thuc te"}},
            {{"Hiragana & Katakana","Tu vung & Ngu phap N5","Hoi thoai co ban N5","Kanji N5 & N4","Ngu phap N4 nang cao","Luyen thi JLPT N4"}},
            {{"Dinh vi & Xac dinh gia tri cot loi","Xay dung noi dung chuyen mon","LinkedIn & Mang xa hoi chuyen nghiep","Networking & Xay dung quan he","Monetize Personal Brand"}},
            {{"Blockchain & Cong nghe nen tang","Bitcoin & Ethereum chuyen sau","DeFi & Yield Farming","NFT & Web3","Phan tich on-chain","Quan ly rui ro & Chien luoc dau tu"}},
            {{"Giao dien Photoshop & Cong cu co ban","Chinh sua & Retouching anh","Thiet ke Banner & Poster","Social Media Graphics","Photo Manipulation nang cao","Xuat file & Workflow chuyen nghiep"}},
            {{"Tong quan Email Marketing","Xay dung danh sach email","Thiet ke email & Copywriting","Automation & Workflow","A/B Testing & Toi uu","Phan tich & Bao cao"}},
            {{"Spring Boot Fundamentals","REST API voi Spring MVC","Spring Security & JWT","JPA & Hibernate","Microservices Architecture","Docker & Deployment"}},
            {{"Gioi thieu Yoga & Loi ich","Cac tu the Yoga co ban","Yoga buoi sang 15 phut","Ky thuat tho & Pranayama","Thien dinh & Mindfulness"}}
        };

        // Generic lesson titles per chapter position
        String[][] genericLessons = {
            {"Bai 1: Gioi thieu & Tong quan","Bai 2: Khai niem co ban","Bai 3: Thuc hanh buoc dau","Bai 4: Bai tap thuc hanh"},
            {"Bai 1: Ly thuyet nen tang","Bai 2: Vi du thuc te","Bai 3: Thuc hanh tren may","Bai 4: Kiem tra kien thuc"},
            {"Bai 1: Cong cu va phuong phap","Bai 2: Huong dan chi tiet","Bai 3: Case study thuc te","Bai 4: Tong ket chuong"},
            {"Bai 1: Nang cao & Mo rong","Bai 2: Ung dung thuc tien","Bai 3: Lam du an nho","Bai 4: Review & Q&A"},
            {"Bai 1: Chien luoc tong the","Bai 2: Thuc thi & Trien khai","Bai 3: Do luong & Toi uu","Bai 4: Tong ket & Huong dan tiep theo"},
            {"Bai 1: Gioi thieu chuong","Bai 2: Kien thuc chinh","Bai 3: Thuc hanh & Demo","Bai 4: Bai tap ve nha"},
            {"Bai 1: Tong quan chu de","Bai 2: Phan tich chi tiet","Bai 3: Ap dung thuc te","Bai 4: Ket luan & Buoc tiep theo"}
        };

        for (int i = 0; i < COURSES.length; i++) {
            Object[] c = COURSES[i];
            Course course = new Course();
            course.setName((String) c[0]);
            course.setDescription((String) c[1]);
            course.setPrice((Double) c[2]);
            course.setImage((String) c[3]);
            course.setCategory((String) c[4]);
            course.setInstructorId((String) c[5]);
            course.setType((String) c[6]);
            course.setStatus("PUBLISHED");
            course = courseRepository.save(course);

            String[] chapters = chapterData[i][0];
            for (int j = 0; j < chapters.length; j++) {
                Chapter chapter = new Chapter();
                chapter.setTitle(chapters[j]);
                chapter.setOrderNumber(j + 1);
                chapter.setStatus("ACTIVE");
                chapter.setCourse(course);
                chapter = chapterRepository.save(chapter);

                // Get lesson titles: use detailed ones for first 5 courses, generic for rest
                String[] lessonTitles;
                if (i < LESSONS.length && j < LESSONS[i].length) {
                    lessonTitles = LESSONS[i][j];
                } else {
                    lessonTitles = genericLessons[j % genericLessons.length];
                }

                for (int k = 0; k < lessonTitles.length; k++) {
                    Lesson lesson = new Lesson();
                    lesson.setTitle(lessonTitles[k]);
                    lesson.setOrderNumber(k + 1);
                    lesson.setIsFree(k == 0);
                    lesson.setStatus("ACTIVE");
                    lesson.setChapter(chapter);
                    lesson = lessonRepository.save(lesson);

                    String safeTitle = lessonTitles[k].replaceAll("[^a-zA-Z0-9 ]", "").trim().replaceAll("\\s+", "-").toLowerCase();
                    if (safeTitle.length() > 40) safeTitle = safeTitle.substring(0, 40);

                    // Video YouTube - xen kẽ 2 link
                    String[] youtubeUrls = {
                        "https://www.youtube.com/watch?v=AFfnd-m5u8g&t=953s",
                        "https://www.youtube.com/watch?v=g26EvuuRzzY&t=1213s"
                    };
                    Lesson_file video = new Lesson_file();
                    video.setFileName(safeTitle + ".mp4");
                    video.setFileUrl(youtubeUrls[k % 2]);
                    video.setFileType("video/youtube");
                    video.setOrderNumber(1);
                    video.setLesson(lesson);
                    lessonFileRepository.save(video);

                    // PDF - Google Drive
                    int pattern = k % 4;
                    if (pattern == 1 || pattern == 3) {
                        Lesson_file pdf = new Lesson_file();
                        pdf.setFileName("tai-lieu-" + safeTitle + ".pdf");
                        pdf.setFileUrl("https://drive.google.com/file/d/1IGiU4wx0XiLo9suWTbbjBeNxhQucQUhw/view?usp=sharing");
                        pdf.setFileType("application/gpdf");
                        pdf.setOrderNumber(2);
                        pdf.setLesson(lesson);
                        lessonFileRepository.save(pdf);
                    }

                    // DOC - Google Drive (dùng cùng link PDF làm placeholder)
                    if (pattern == 2 || pattern == 3) {
                        Lesson_file doc = new Lesson_file();
                        doc.setFileName("bai-tap-" + safeTitle + ".docx");
                        doc.setFileUrl("https://drive.google.com/file/d/1IGiU4wx0XiLo9suWTbbjBeNxhQucQUhw/view?usp=sharing");
                        doc.setFileType("application/gpdf");
                        doc.setOrderNumber(pattern == 3 ? 3 : 2);
                        doc.setLesson(lesson);
                        lessonFileRepository.save(doc);
                    }
                }
            }
        }

        System.out.println("SEED 30 COURSES WITH LESSONS & FILES DONE!");
    }
}
