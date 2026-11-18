document.addEventListener('DOMContentLoaded', () => {
    let booksData = [];
    let currentCategory = 'all';
    let searchQuery = '';

    const shelvesContainer = document.getElementById('shelvesContainer');
    const searchInput = document.getElementById('searchInput');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const readerDrawer = document.getElementById('readerDrawer');
    const closeDrawerBtn = document.getElementById('closeDrawer');
    const shelfReturnBtn = document.getElementById('shelfReturnBtn');

    // Drawer Elements
    const drawerBookCover = document.getElementById('drawerBookCover');
    const drawerCategory = document.getElementById('drawerCategory');
    const drawerBookTitle = document.getElementById('drawerBookTitle');
    const drawerAuthor = document.getElementById('drawerAuthor');
    const drawerWebsiteBadge = document.getElementById('drawerWebsiteBadge');
    const drawerPublishedDate = document.getElementById('drawerPublishedDate');
    const drawerDateAdded = document.getElementById('drawerDateAdded');
    const drawerTitleHeading = document.getElementById('drawerTitleHeading');
    const drawerAuthorName = document.getElementById('drawerAuthorName');
    const drawerSummaryText = document.getElementById('drawerSummaryText');
    const drawerReadBtn = document.getElementById('drawerReadBtn');

    const categoryTitles = {
        'ai': 'Artificial Intelligence & Machine Learning',
        'science': 'Computer Science & Software Engineering',
        'self improvement': 'Self Improvement & Personal Growth',
        'brain': 'Brain, Cognition & Philosophy',
        'making money': 'Wealth Creation & Making Money',
        'freelancing': 'Freelancing & Solopreneurship'
    };

    // Load Books from books.json
    async function loadBooks() {
        try {
            const response = await fetch('books.json');
            booksData = await response.json();
            renderShelves();
        } catch (error) {
            console.error('Error loading books.json:', error);
            shelvesContainer.innerHTML = `<div class="text-center text-red-400 py-12">Failed to load library books. Please ensure books.json is in the root directory.</div>`;
        }
    }

    // Render 3D Bookshelves & Authentic Proportional Books
    function renderShelves() {
        shelvesContainer.innerHTML = '';

        const categoriesToRender = currentCategory === 'all'
            ? Object.keys(categoryTitles)
            : [currentCategory];

        categoriesToRender.forEach(catKey => {
            const filteredBooks = booksData.filter(book => {
                const matchesCategory = book.category === catKey;
                const matchesSearch = searchQuery === '' ||
                    book.title.toLowerCase().includes(searchQuery) ||
                    book.author.toLowerCase().includes(searchQuery) ||
                    book.website.toLowerCase().includes(searchQuery) ||
                    book.summary.toLowerCase().includes(searchQuery);
                return matchesCategory && matchesSearch;
            });

            if (searchQuery !== '' && filteredBooks.length === 0) return;

            // Shelf Section Wrapper
            const shelfSection = document.createElement('div');
            shelfSection.className = 'space-y-3';

            // Category Header
            const headerDiv = document.createElement('div');
            headerDiv.className = 'flex items-center justify-between border-b border-vault-700/60 pb-2.5';
            headerDiv.innerHTML = `
                <div class="flex items-center space-x-2.5">
                    <div class="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></div>
                    <h2 class="text-lg font-bold font-['Cinzel'] tracking-wide text-gray-100">${categoryTitles[catKey]}</h2>
                </div>
                <span class="text-[11px] font-['JetBrains_Mono'] text-gray-300 bg-vault-800 px-3 py-1 rounded-lg border border-vault-600 shadow-inner">${filteredBooks.length} Volumes</span>
            `;
            shelfSection.appendChild(headerDiv);

            // 3D Bookshelf Unit (Compact & Authentic)
            const bookshelfUnit = document.createElement('div');
            bookshelfUnit.className = 'bookshelf-unit';

            const shelfRowScroll = document.createElement('div');
            shelfRowScroll.className = 'shelf-row-scroll scrollbar-none';

            if (filteredBooks.length === 0) {
                shelfRowScroll.innerHTML = `<p class="text-xs text-gray-500 italic w-full text-center py-8 font-['Inter']">No volumes found on this shelf.</p>`;
            } else {
                filteredBooks.forEach(book => {
                    const book3D = document.createElement('div');
                    book3D.className = 'book-3d';
                    book3D.setAttribute('data-id', book.id);

                    let dailyBadge = book.isDailyPick ? `<span class="absolute -top-3 -right-2 bg-amber-500 text-black text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow-lg animate-pulse z-20">NEW</span>` : '';

                    book3D.innerHTML = `
                        ${dailyBadge}
                        <div class="book-spine bg-gradient-to-b ${book.color}">
                            <div class="text-[8px] font-['JetBrains_Mono'] uppercase tracking-widest px-1 py-0.5 rounded bg-black/40 text-white font-bold text-center mb-2">${book.category.substring(0,3)}</div>
                            <div class="spine-title text-white">${book.title}</div>
                            <div class="border-t border-white/20 pt-1 mt-auto">
                                <p class="text-[7px] font-['Inter'] text-gray-200 font-medium truncate">${book.author}</p>
                                <p class="text-[7px] font-['JetBrains_Mono'] text-emerald-300 truncate">${book.dateAdded}</p>
                            </div>
                        </div>
                    `;

                    // Click event for 3D Fall-down extraction and reader view
                    book3D.addEventListener('click', () => {
                        trigger3DExtraction(book, book3D);
                    });

                    shelfRowScroll.appendChild(book3D);
                });
            }

            bookshelfUnit.appendChild(shelfRowScroll);
            shelfSection.appendChild(bookshelfUnit);
            shelvesContainer.appendChild(shelfSection);
        });
    }

    // 3D Book Extraction Animation & Drawer Opening
    function trigger3DExtraction(book, bookEl) {
        bookEl.classList.add('book-falling');

        setTimeout(() => {
            bookEl.classList.remove('book-falling');
            openReaderDrawer(book);
        }, 500);
    }

    // Open Reader Drawer
    function openReaderDrawer(book) {
        drawerCategory.textContent = book.category.toUpperCase();
        drawerBookTitle.textContent = book.title;
        drawerAuthor.textContent = `By ${book.author}`;
        drawerWebsiteBadge.textContent = book.website;
        drawerPublishedDate.textContent = `Published: ${book.publishedDate}`;
        drawerDateAdded.textContent = `Added: ${book.dateAdded}`;
        drawerTitleHeading.textContent = book.title;
        drawerAuthorName.textContent = book.author;
        drawerReadBtn.href = book.url;

        drawerBookCover.className = `w-44 h-60 rounded-lg shadow-2xl p-5 flex flex-col justify-between transform hover:scale-105 transition-transform cursor-pointer border border-white/20 bg-gradient-to-br ${book.color}`;
        drawerBookCover.onclick = () => window.open(book.url, '_blank');

        const summaryLines = book.summary.split('\n');
        drawerSummaryText.innerHTML = summaryLines.map(line => `<p class="flex items-start space-x-2"><span class="text-blue-400 font-bold">•</span> <span>${line.replace(/^[0-9]+\.\s*/, '')}</span></p>`).join('');

        readerDrawer.classList.remove('hidden');
        readerDrawer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function closeDrawer() {
        readerDrawer.classList.add('hidden');
    }

    closeDrawerBtn.addEventListener('click', closeDrawer);
    shelfReturnBtn.addEventListener('click', closeDrawer);

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderShelves();
    });

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => {
                b.classList.remove('active-tab');
                b.classList.add('btn-editorial', 'text-gray-300');
            });
            btn.classList.add('active-tab');
            btn.classList.remove('text-gray-300');

            currentCategory = btn.getAttribute('data-category');
            renderShelves();
        });
    });

    loadBooks();
});
